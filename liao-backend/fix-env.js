
const fs = require('fs');
const content = `DATABASE_URL="postgresql://postgres:Liao2025%40%23%24@db.ayprjupbxksuxqdyrpsl.supabase.co:5432/postgres?schema=public"
# FRONTEND_URL="http://localhost:5173"
# PORT=3001
`;
fs.writeFileSync('.env', content, 'utf8');
console.log('.env fixed with UTF-8');
