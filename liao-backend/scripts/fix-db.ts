import prisma from '../src/config/database';

async function main() {
  try {
    console.log('Adding column isLeaguePartner to Partner table...');
    // Using raw SQL as db push is stuck
    await prisma.$executeRawUnsafe('ALTER TABLE "Partner" ADD COLUMN "isLeaguePartner" BOOLEAN DEFAULT true;');
    console.log('Column added successfully!');
  } catch (error: any) {
    if (error.message.includes('already exists')) {
        console.log('Column already exists, skipping.');
    } else {
        console.error('Error adding column:', error);
    }
  } finally {
    await prisma.$disconnect();
  }
}

main();
