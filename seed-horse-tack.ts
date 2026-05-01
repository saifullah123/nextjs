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

  await prisma.product.create({
    data: {
      title: 'Pro-Safety Riding Helmet',
      slug: 'pro-safety-helmet',
      price: 250.00,
      quantity: 15,
      shortDescription: 'Lightweight and high-impact resistance.',
      longDescription: 'Our Pro-Safety helmet combines sleek aesthetics with top-tier protection technology, featuring a moisture-wicking liner and adjustable ventilation.',
      mainImage: 'https://images.unsplash.com/photo-1605733513597-a8f8341084e6?q=80&w=1000&auto=format&fit=crop',
      isFeatured: true,
      categoryId: catApparel.id,
    },
  });

  await prisma.product.create({
    data: {
      title: 'Classic Leather Riding Boots',
      slug: 'classic-leather-boots',
      price: 320.00,
      quantity: 10,
      shortDescription: 'Handcrafted tall boots for the perfect leg position.',
      longDescription: 'Made from premium cowhide, these tall boots feature a reinforced sole and ergonomic design for all-day comfort in the saddle.',
      mainImage: 'https://images.unsplash.com/photo-1601989398731-903126f5888e?q=80&w=1000&auto=format&fit=crop',
      categoryId: catApparel.id,
    },
  });

  await prisma.product.create({
    data: {
      title: 'Weather-Proof Horse Blanket',
      slug: 'horse-blanket-weather-proof',
      price: 150.00,
      quantity: 30,
      shortDescription: 'Heavy-duty protection for cold winter nights.',
      mainImage: 'https://images.unsplash.com/photo-1598974357801-cbca100e65d3?q=80&w=1000&auto=format&fit=crop',
      categoryId: catStable.id,
    },
  });

  await prisma.product.create({
    data: {
      title: 'Deluxe Grooming Kit',
      slug: 'deluxe-grooming-kit',
      price: 85.00,
      quantity: 50,
      shortDescription: '10-piece professional grooming set.',
      mainImage: 'https://images.unsplash.com/photo-1566411520896-01e7ca4726af?q=80&w=1000&auto=format&fit=crop',
      categoryId: catStable.id,
    },
  });

  // 3.1 Adding back Western Show Shirts
  console.log('Seeding Show Shirts...');
  await prisma.product.create({
    data: {
      title: 'Handcrafted Black Western Show Shirt',
      slug: 'handcrafted-black-western-show-shirt',
      price: 350.00,
      quantity: 10,
      shortDescription: 'Gold & Blue Crystal Equestrian Apparel.',
      longDescription: 'Meticulously crafted with hand-placed crystals and reinforced stitching for lasting arena durability.',
      mainImage: '/images/vibrant-red-show-shirt.png', // Using existing image as placeholder
      isFeatured: true,
      categoryId: catApparel.id,
    },
  });

  await prisma.product.create({
    data: {
      title: 'Embellished Emerald Green Western Shirt',
      slug: 'embellished-emerald-green-western-shirt',
      price: 375.00,
      quantity: 8,
      shortDescription: 'Handcrafted Crystal Collar & Cuffs.',
      mainImage: '/images/red-rainbow-stone-shirt.png',
      categoryId: catApparel.id,
    },
  });

  await prisma.product.create({
    data: {
      title: 'Net Gate Light Blue Western Show Shirt',
      slug: 'light-blue-western-show-shirt',
      price: 340.00,
      quantity: 12,
      shortDescription: 'Handcrafted Crystal Embellished Equestrian Apparel.',
      mainImage: '/images/red-show-shirt.png',
      categoryId: catApparel.id,
    },
  });

  await prisma.product.create({
    data: {
      title: 'Premium Charcoal Grey Women\'s Show Shirt',
      slug: 'premium-charcoal-grey-show-shirt',
      price: 390.00,
      quantity: 5,
      shortDescription: 'Handcrafted Crystal & Stone Embroidery.',
      mainImage: '/images/vibrant-red-show-shirt.png',
      isFeatured: true,
      categoryId: catApparel.id,
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
