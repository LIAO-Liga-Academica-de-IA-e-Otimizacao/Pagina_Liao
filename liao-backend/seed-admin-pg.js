
const { Client } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const client = new Client({
    connectionString: process.env.DATABASE_URL,
});

async function main() {
    const email = 'admin@liao.com';
    const password = 'admin';
    const name = 'Admin Liao';
    const hashedPassword = await bcrypt.hash(password, 10);
    const now = new Date().toISOString();

    try {
        await client.connect();
        console.log('Connected to DB');

        const text = `
      INSERT INTO "User" (email, password, name, role, "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, $5)
      ON CONFLICT (email) DO NOTHING
      RETURNING *
    `;
        const values = [email, hashedPassword, name, 'admin', now];

        const res = await client.query(text, values);
        if (res.rows.length > 0) {
            console.log('✅ Admin user created:', res.rows[0]);
        } else {
            console.log('ℹ️ Admin user already exists.');
        }

    } catch (err) {
        console.error('❌ Error seeding:', err);
    } finally {
        await client.end();
    }
}

main();
