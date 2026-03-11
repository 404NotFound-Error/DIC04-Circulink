import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// String constants for SQLite compatibility
const Condition = {
  NEW: 'NEW',
  LIKE_NEW: 'LIKE_NEW',
  GOOD: 'GOOD',
  FAIR: 'FAIR'
};

const ItemStatus = {
  DRAFT: 'DRAFT',
  ACTIVE: 'ACTIVE',
  SOLD: 'SOLD',
  ARCHIVED: 'ARCHIVED'
};

async function quickSeed() {
  try {
    // Create categories
    const categories = [
      { name: 'Development Boards', slug: 'dev-boards' },
      { name: 'Components', slug: 'components' },
      { name: 'Measurement Tools', slug: 'measurement-tools' },
      { name: 'Kits & Bundles', slug: 'kits-bundles' },
      { name: 'Displays', slug: 'displays' },
      { name: 'Power & Batteries', slug: 'power-batteries' }
    ];

    for (const cat of categories) {
      await prisma.category.upsert({
        where: { slug: cat.slug },
        update: { name: cat.name },
        create: cat
      });
    }

    // Create sellers
    const seller1 = await prisma.user.upsert({
      where: { email: 'seller@circulink.dev' },
      update: {},
      create: {
        email: 'seller@circulink.dev',
        passwordHash: 'hash',
        name: 'Nora Chen',
        role: 'USER'
      }
    });

    const seller2 = await prisma.user.upsert({
      where: { email: 'seller2@circulink.dev' },
      update: {},
      create: {
        email: 'seller2@circulink.dev',
        passwordHash: 'hash',
        name: 'Evan Moore',
        role: 'USER'
      }
    });

    // Create sample items
    const devBoardsCat = await prisma.category.findFirst({ where: { slug: 'dev-boards' } });
    const componentsCat = await prisma.category.findFirst({ where: { slug: 'components' } });
    const toolsCat = await prisma.category.findFirst({ where: { slug: 'measurement-tools' } });

    if (!devBoardsCat || !componentsCat || !toolsCat) {
      throw new Error('Categories not found');
    }

    const items = [
      {
        title: 'Arduino Uno R3',
        description: 'Beginner-friendly board with pin labels and USB cable.',
        price: 158.00,
        condition: Condition.GOOD,
        status: ItemStatus.ACTIVE,
        images: JSON.stringify(['https://via.placeholder.com/300?text=Arduino+Uno']),
        sellerId: seller1.id,
        categoryId: devBoardsCat.id
      },
      {
        title: 'Raspberry Pi 4B 4GB',
        description: 'Includes heatsinks and case, boots reliably.',
        price: 299.00,
        condition: Condition.LIKE_NEW,
        status: ItemStatus.ACTIVE,
        images: JSON.stringify(['https://via.placeholder.com/300?text=Raspberry+Pi']),
        sellerId: seller1.id,
        categoryId: devBoardsCat.id
      },
      {
        title: 'Digital Multimeter',
        description: 'Backlit display with fresh probes.',
        price: 79.00,
        condition: Condition.GOOD,
        status: ItemStatus.ACTIVE,
        images: JSON.stringify(['https://via.placeholder.com/300?text=Multimeter']),
        sellerId: seller2.id,
        categoryId: toolsCat.id
      },
      {
        title: 'Assorted Resistor Pack',
        description: '1/4W with common values, labeled bags.',
        price: 26.00,
        condition: Condition.GOOD,
        status: ItemStatus.ACTIVE,
        images: JSON.stringify(['https://via.placeholder.com/300?text=Resistors']),
        sellerId: seller2.id,
        categoryId: componentsCat.id
      },
      {
        title: '128x64 OLED Display',
        description: 'I2C OLED display, tested and working.',
        price: 36.00,
        condition: Condition.GOOD,
        status: ItemStatus.ACTIVE,
        images: JSON.stringify(['https://via.placeholder.com/300?text=OLED+Display']),
        sellerId: seller1.id,
        categoryId: devBoardsCat.id
      },
      {
        title: 'Li-ion Battery Pack (2x 18650)',
        description: 'Includes holder and JST connector.',
        price: 52.00,
        condition: Condition.GOOD,
        status: ItemStatus.ACTIVE,
        images: JSON.stringify(['https://via.placeholder.com/300?text=Battery+Pack']),
        sellerId: seller2.id,
        categoryId: devBoardsCat.id
      }
    ];

    for (const item of items) {
      await prisma.item.create({ data: item });
    }

    console.log('✅ Seed data created successfully!');
  } catch (error) {
    console.error('❌ Seed failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

quickSeed();
