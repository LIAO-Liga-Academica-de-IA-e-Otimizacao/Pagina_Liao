import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import { Client } from 'pg';
import * as net from 'net';

function checkPort(port: number, host: string): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    const onError = () => {
      socket.destroy();
      resolve(false);
    };
    socket.setTimeout(1000);
    socket.once('error', onError);
    socket.once('timeout', onError);
    socket.connect(port, host, () => {
      socket.end();
      resolve(true);
    });
  });
}

async function tryConnect(dbUrl: string): Promise<{ success: boolean; error?: any }> {
  const client = new Client({ connectionString: dbUrl });
  try {
    await client.connect();
    await client.end();
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
}

async function main() {
  const envPath = path.join(__dirname, '../.env');
  const envExamplePath = path.join(__dirname, '../.env.example');

  // 1. Copy .env if not exists
  let envCreated = false;
  if (!fs.existsSync(envPath)) {
    console.log('📝 Creating .env from .env.example...');
    fs.copyFileSync(envExamplePath, envPath);
    envCreated = true;
  }

  // Load environment variables
  require('dotenv').config({ path: envPath });

  let dbUrl = process.env.DATABASE_URL || '';

  // 2. Autofix DATABASE_URL if it is the default placeholder
  const defaultPlaceholder = 'postgresql://username:password@localhost:5432/liao_db?schema=public';
  if (dbUrl === defaultPlaceholder || envCreated) {
    const isPortOpen = await checkPort(5432, 'localhost');
    if (isPortOpen) {
      const currentUser = process.env.USER || process.env.USERNAME || 'postgres';
      const localUrl = `postgresql://${currentUser}@localhost:5432/postgres`;
      console.log(`🔍 Port 5432 is open. Checking if we can connect as user "${currentUser}"...`);
      
      const connTest = await tryConnect(localUrl);
      if (connTest.success) {
        const newDbUrl = `postgresql://${currentUser}@localhost:5432/liao_db?schema=public`;
        console.log(`⚙️ Detected running local PostgreSQL. Updating DATABASE_URL in .env to:`);
        console.log(`   ${newDbUrl}`);
        
        let envContent = fs.readFileSync(envPath, 'utf8');
        envContent = envContent.replace(dbUrl, newDbUrl);
        fs.writeFileSync(envPath, envContent, 'utf8');
        dbUrl = newDbUrl;
        
        // Reload environment variables
        process.env.DATABASE_URL = dbUrl;
      }
    }
  }

  // Parse DB details
  const match = dbUrl.match(/postgres(?:ql)?:\/\/([^:]+)(?::([^@]+))?@([^:/]+)(?::(\d+))?\/([^?]+)/);
  if (!match) {
    console.error('❌ Invalid DATABASE_URL in .env');
    process.exit(1);
  }
  const [_, user, password, host, portStr, dbName] = match;
  const port = portStr ? parseInt(portStr) : 5432;

  // 3. Connect/Start database
  console.log(`📡 Connecting to PostgreSQL at ${host}:${port}...`);
  let isReady = false;
  
  // Try connecting
  const connCheck = await tryConnect(dbUrl);
  if (connCheck.success) {
    console.log('✅ Connected to database successfully.');
    isReady = true;
  } else {
    const pgErr = connCheck.error as any;
    // If database does not exist, we can create it
    if (pgErr && pgErr.code === '3D000') {
      console.log(`🚧 Database "${dbName}" does not exist. Attempting to create it...`);
      const adminUrl = dbUrl.replace(`/${dbName}`, '/postgres');
      const adminClient = new Client({ connectionString: adminUrl });
      try {
        await adminClient.connect();
        await adminClient.query(`CREATE DATABASE "${dbName}"`);
        await adminClient.end();
        console.log(`✅ Created database "${dbName}" successfully.`);
        isReady = true;
      } catch (createErr) {
        console.error(`❌ Failed to create database "${dbName}":`, (createErr as Error).message);
        adminClient.end().catch(() => {});
      }
    } else if (host === 'localhost' || host === '127.0.0.1') {
      // Connection refused or port closed, let's try starting docker-compose
      console.log('🐳 Database connection failed. Attempting to start PostgreSQL via Docker Compose...');
      try {
        execSync('docker compose up -d', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
        
        console.log('⏳ Waiting for PostgreSQL container to start up...');
        let retries = 30;
        while (!isReady && retries > 0) {
          const retryCheck = await tryConnect(dbUrl);
          if (retryCheck.success) {
            console.log('✅ PostgreSQL container is ready!');
            isReady = true;
          } else {
            const retryErr = retryCheck.error as any;
            if (retryErr && retryErr.code === '3D000') {
              // Create it
              const adminUrl = dbUrl.replace(`/${dbName}`, '/postgres');
              const adminClient = new Client({ connectionString: adminUrl });
              try {
                await adminClient.connect();
                await adminClient.query(`CREATE DATABASE "${dbName}"`);
                await adminClient.end();
                console.log(`✅ Created database "${dbName}" successfully.`);
                isReady = true;
              } catch (cErr) {
                adminClient.end().catch(() => {});
              }
            } else {
              retries--;
              if (retries === 0) {
                console.error('❌ Timed out waiting for PostgreSQL container.');
                process.exit(1);
              }
              await new Promise((resolve) => setTimeout(resolve, 1000));
            }
          }
        }
      } catch (dockerErr) {
        console.error('❌ Failed to launch Docker Compose or connect to database:', (dockerErr as Error).message);
        process.exit(1);
      }
    } else {
      console.error('❌ Failed to connect to database:', pgErr.message);
      process.exit(1);
    }
  }

  if (!isReady) {
    console.error('❌ Database is not ready. Setup aborted.');
    process.exit(1);
  }

  // 4. Run Prisma migrations
  console.log('🔄 Running Prisma migrations...');
  try {
    execSync('npx prisma migrate dev', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
    console.log('🚀 Database setup completed successfully!');
  } catch (error) {
    console.error('❌ Failed to run Prisma migrations.');
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
