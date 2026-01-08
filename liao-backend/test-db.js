
const { Client } = require('pg');

const connectionString = 'postgresql://postgres:Liao2025%40%23%24@db.ayprjupbxksuxqdyrpsl.supabase.co:5432/postgres';

console.log('Testing connection to:', connectionString.replace(/:[^:@]+@/, ':****@'));

const client = new Client({
    connectionString: connectionString,
});

async function test() {
    try {
        await client.connect();
        console.log('✅ Connection successful!');
        const res = await client.query('SELECT NOW()');
        console.log('Current Time from DB:', res.rows[0]);
        await client.end();
    } catch (err) {
        console.error('❌ Connection failed:', err);
    }
}

test();
