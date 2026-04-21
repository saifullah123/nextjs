import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Seeding Horse Tack Data ---');

  // 1. Clear existing data
  console.log('Cleaning existing data...');
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.banner.deleteMany({});
  await prisma.testimonial.deleteMany({});

  // 2. Seed Categories
  console.log('Seeding Categories...');
  const catSaddles = await prisma.category.create({
    data: {
      name: 'Premium Saddles',
      slug: 'saddles',
      description: 'Handcrafted leather saddles for elite riders.',
      metaTitle: 'Luxury Horse Saddles | EquineElite',
      metaDescription: 'Discover our collection of premium dressage, jumping, and western saddles.',
    },
  });

  const catBridles = await prisma.category.create({
    data: {
      name: 'Bridles & Reins',
      slug: 'bridles',
      description: 'Elegant headstalls and reins with precision craftsmanship.',
    },
  });

  const catApparel = await prisma.category.create({
    data: {
      name: 'Rider Apparel',
      slug: 'apparel',
      description: 'Sophisticated attire for the modern equestrian.',
    },
  });

  const catStable = await prisma.category.create({
    data: {
      name: 'Stable & Grooming',
      slug: 'stable-grooming',
      description: 'Essential luxury tools for your stable.',
    },
  });

  // 3. Seed Products
  console.log('Seeding Products...');
  await prisma.product.create({
    data: {
      title: 'Heritage Dressage Saddle',
      slug: 'heritage-dressage-saddle',
      price: 4500.00,
      quantity: 5,
      shortDescription: 'The pinnacle of comfort and precision for dressage.',
      longDescription: 'Crafted from the finest Italian calfskin, the Heritage Dressage Saddle offers unparalleled close-contact feel and ergonomic support for both horse and rider.',
      mainImage: '/images/saddle-hero.png',
      isFeatured: true,
      status: 'in_stock',
      categoryId: catSaddles.id,
    },
  });

  await prisma.product.create({
    data: {
      title: 'Artisan Bridle - Brass Accents',
      slug: 'artisan-bridle-brass',
      price: 480.00,
      quantity: 12,
      shortDescription: 'Elegance meets functionality in every stitch.',
      longDescription: 'This hand-stitched bridle features premium vegetable-tanned leather and high-polish brass hardware for a timeless look.',
      mainImage: '/images/bridle-detail.png',
      status: 'in_stock',
      categoryId: catBridles.id,
    },
  });

  await prisma.product.create({
    data: {
      title: 'Elite Stability Girth',
      slug: 'elite-stability-girth',
      price: 185.00,
      quantity: 20,
      shortDescription: 'Advanced pressure distribution for your horse.',
      mainImage: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?q=80&w=1000&auto=format&fit=crop',
      categoryId: catSaddles.id,
    },
  });

  // 4. Seed Banners
  console.log('Seeding Banners...');
  await prisma.banner.create({
    data: {
      title: 'Equestrian Excellence',
      subtitle: 'Experience the fusion of tradition and innovation.',
      image: '/images/saddle-hero.png',
      order: 1,
      isActive: true,
    },
  });

  await prisma.banner.create({
    data: {
      title: 'The Modern Stable',
      subtitle: 'Premium gear for the horse that deserves the best.',
      image: '/images/stable-lifestyle.png',
      order: 2,
      isActive: true,
    },
  });

  // 5. Seed Testimonials
  console.log('Seeding Testimonials...');
  await prisma.testimonial.create({
    data: {
      name: 'Alexandra Vance',
      role: 'Grand Prix Rider',
      content: 'The quality of the leather and the attention to detail is unlike anything I have used in 20 years of riding.',
      rating: 5,
    },
  });

  await prisma.testimonial.create({
    data: {
      name: 'Marcus Thorne',
      role: 'Stable Manager',
      content: 'Outstanding durability and timeless style. EquineElite is my go-to for all our competitive gear.',
      rating: 5,
    },
  });

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
