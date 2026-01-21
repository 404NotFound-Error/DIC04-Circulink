import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

const categories = [
  { name: 'Components', slug: 'components' },
  { name: 'Development Boards', slug: 'dev-boards' },
  { name: 'Measurement Tools', slug: 'measurement-tools' },
  { name: 'Tools & Accessories', slug: 'tools-accessories' },
];

const sampleItems = [
  {
    title: 'Arduino Uno R3',
    description: 'Beginner-friendly board with pin labels.',
    price: '158.00',
    condition: 'good',
    status: 'available',
    images: ['/uploads/sample-uno.jpg'],
    categorySlug: 'dev-boards',
  },
  {
    title: 'Raspberry Pi 4B 4GB',
    description: 'Includes heatsinks and runs stable.',
    price: '299.00',
    condition: 'excellent',
    status: 'available',
    images: ['/uploads/sample-pi.jpg'],
    categorySlug: 'dev-boards',
  },
  {
    title: 'Digital Multimeter',
    description: 'Backlit display for basic measurements.',
    price: '79.00',
    condition: 'good',
    status: 'available',
    images: ['/uploads/sample-meter.jpg'],
    categorySlug: 'measurement-tools',
  },
  {
    title: 'Breadboard Starter Kit',
    description: 'Includes jumpers and resistor pack.',
    price: '45.00',
    condition: 'excellent',
    status: 'available',
    images: ['/uploads/sample-breadboard.jpg'],
    categorySlug: 'tools-accessories',
  },
  {
    title: 'Assorted Resistor Pack',
    description: '1/4W with common values.',
    price: '26.00',
    condition: 'good',
    status: 'available',
    images: ['/uploads/sample-resistors.jpg'],
    categorySlug: 'components',
  },
];

async function main() {
  const categoryRecords = await Promise.all(
    categories.map((category) =>
      prisma.category.upsert({
        where: { slug: category.slug },
        update: { name: category.name },
        create: category,
      }),
    ),
  );

  const [seller, buyer] = await Promise.all([
    prisma.user.upsert({
      where: { email: 'seller@circulink.dev' },
      update: {
        passwordHash: 'seeded-password-hash',
        profile: {
          upsert: {
            update: {
              displayName: 'Circuit Vendor',
              avatarUrl: '/uploads/sample-seller.jpg',
              bio: 'Focused on second-hand electronics and boards.',
            },
            create: {
              displayName: 'Circuit Vendor',
              avatarUrl: '/uploads/sample-seller.jpg',
              bio: 'Focused on second-hand electronics and boards.',
            },
          },
        },
      },
      create: {
        email: 'seller@circulink.dev',
        passwordHash: 'seeded-password-hash',
        profile: {
          create: {
            displayName: 'Circuit Vendor',
            avatarUrl: '/uploads/sample-seller.jpg',
            bio: 'Focused on second-hand electronics and boards.',
          },
        },
      },
    }),
    prisma.user.upsert({
      where: { email: 'buyer@circulink.dev' },
      update: {
        passwordHash: 'seeded-password-hash',
        profile: {
          upsert: {
            update: {
              displayName: 'Circuit Learner',
              avatarUrl: '/uploads/sample-buyer.jpg',
              bio: 'A buyer who loves DIY learning.',
            },
            create: {
              displayName: 'Circuit Learner',
              avatarUrl: '/uploads/sample-buyer.jpg',
              bio: 'A buyer who loves DIY learning.',
            },
          },
        },
      },
      create: {
        email: 'buyer@circulink.dev',
        passwordHash: 'seeded-password-hash',
        profile: {
          create: {
            displayName: 'Circuit Learner',
            avatarUrl: '/uploads/sample-buyer.jpg',
            bio: 'A buyer who loves DIY learning.',
          },
        },
      },
    }),
  ]);

  const items = [];
  await prisma.item.deleteMany({
    where: {
      sellerId: seller.id,
      title: { in: sampleItems.map((entry) => entry.title) },
    },
  });

  for (const entry of sampleItems) {
    const category = categoryRecords.find((record) => record.slug === entry.categorySlug);
    if (!category) {
      continue;
    }

    const item = await prisma.item.create({
      data: {
        title: entry.title,
        description: entry.description,
        price: new Prisma.Decimal(entry.price),
        condition: entry.condition,
        status: entry.status,
        images: entry.images,
        sellerId: seller.id,
        categoryId: category.id,
      },
    });
    items.push(item);
  }

  if (items.length > 0) {
    await prisma.favorite.upsert({
      where: {
        userId_itemId: {
          userId: buyer.id,
          itemId: items[0].id,
        },
      },
      update: {},
      create: {
        userId: buyer.id,
        itemId: items[0].id,
      },
    });
  }
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
