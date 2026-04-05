import prisma from '../src/config/database';

async function main() {
  console.log('=== LIAO DB Migration: RBAC + AuditLog ===');
  
  try {
    // 1. Add permissions column to User table
    console.log('[1/3] Adding permissions column to User...');
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "User" 
      ADD COLUMN IF NOT EXISTS "permissions" TEXT[] DEFAULT '{}';
    `);
    console.log('      ✔ Done');
  } catch (e: any) {
    console.log('      ⚠ Skipped (may already exist):', e.message);
  }

  try {
    // 2. Create AuditLog table
    console.log('[2/3] Creating AuditLog table...');
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "AuditLog" (
        "id"         SERIAL       PRIMARY KEY,
        "userId"     INTEGER      NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
        "userName"   TEXT         NOT NULL,
        "action"     TEXT         NOT NULL,
        "resource"   TEXT         NOT NULL,
        "resourceId" INTEGER,
        "details"    TEXT,
        "createdAt"  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
      );
    `);
    console.log('      ✔ Done');
  } catch (e: any) {
    console.log('      ⚠ Skipped:', e.message);
  }

  try {
    // 3. Create index for performance (filter by resource + date)
    console.log('[3/3] Creating indexes...');
    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "AuditLog_resource_idx" ON "AuditLog"("resource");
    `);
    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "AuditLog_createdAt_idx" ON "AuditLog"("createdAt" DESC);
    `);
    console.log('      ✔ Done');
  } catch (e: any) {
    console.log('      ⚠ Skipped:', e.message);
  }

  console.log('\n✅ Migration complete!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
