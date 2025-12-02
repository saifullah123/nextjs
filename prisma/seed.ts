import { prisma } from '../src/lib/prisma';
import { hashPassword } from '../src/lib/auth';

async function main() {
    console.log('🌱 Starting seed...');

    // Create admin user
    const admin = await prisma.user.upsert({
        where: { email: 'admin@example.com' },
        update: {},
        create: {
            email: 'admin@example.com',
            password: await hashPassword('admin123'),
            name: 'Admin User',
        },
    });
    console.log('✅ Admin user created');

    // Create categories
    const phoneCategory = await prisma.category.upsert({
        where: { slug: 'phone-cases' },
        update: {},
        create: {
            name: 'Phone Cases',
            slug: 'phone-cases',
            description: 'Premium cases for all phone models',
            isActive: true,
        },
    });

    const tabletCategory = await prisma.category.upsert({
        where: { slug: 'tablet-cases' },
        update: {},
        create: {
            name: 'Tablet Cases',
            slug: 'tablet-cases',
            description: 'Protective cases for tablets',
            isActive: true,
        },
    });

    const laptopCategory = await prisma.category.upsert({
        where: { slug: 'laptop-cases' },
        update: {},
        create: {
            name: 'Laptop Cases',
            slug: 'laptop-cases',
            description: 'Durable laptop sleeves and cases',
            isActive: true,
        },
    });
    console.log('✅ Categories created');

    // Create products
    await prisma.product.upsert({
        where: { slug: 'premium-leather-phone-case' },
        update: {},
        create: {
            title: 'Premium Leather Phone Case',
            slug: 'premium-leather-phone-case',
            price: 29.99,
            shortDescription: 'Handcrafted genuine leather case with card slots',
            longDescription: 'Our premium leather phone case combines style and functionality. Made from genuine leather, it features multiple card slots and a sleek design that ages beautifully.',
            mainImage: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500',
            isFeatured: true,
            categoryId: phoneCategory.id,
        },
    });

    await prisma.product.upsert({
        where: { slug: 'clear-protective-case' },
        update: {},
        create: {
            title: 'Clear Protective Case',
            slug: 'clear-protective-case',
            price: 19.99,
            shortDescription: 'Crystal clear case with military-grade protection',
            longDescription: 'Show off your phone\'s original design while keeping it protected. This clear case offers military-grade drop protection without adding bulk.',
            mainImage: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=500',
            isFeatured: true,
            categoryId: phoneCategory.id,
        },
    });

    await prisma.product.upsert({
        where: { slug: 'tablet-folio-case' },
        update: {},
        create: {
            title: 'Tablet Folio Case',
            slug: 'tablet-folio-case',
            price: 39.99,
            shortDescription: 'Multi-angle stand with auto sleep/wake',
            longDescription: 'Perfect for work and entertainment. Features multiple viewing angles, auto sleep/wake functionality, and a soft microfiber interior.',
            mainImage: 'https://images.unsplash.com/photo-1585790050230-5dd28404f869?w=500',
            isFeatured: false,
            categoryId: tabletCategory.id,
        },
    });

    await prisma.product.upsert({
        where: { slug: 'laptop-sleeve-pro' },
        update: {},
        create: {
            title: 'Laptop Sleeve Pro',
            slug: 'laptop-sleeve-pro',
            price: 49.99,
            shortDescription: 'Water-resistant sleeve with extra pockets',
            longDescription: 'Protect your laptop in style. Water-resistant exterior, plush interior padding, and multiple pockets for accessories.',
            mainImage: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500',
            isFeatured: true,
            categoryId: laptopCategory.id,
        },
    });
    console.log('✅ Products created');

    // Create testimonials
    await prisma.testimonial.upsert({
        where: { id: 'testimonial-1' },
        update: {},
        create: {
            id: 'testimonial-1',
            name: 'Sarah Johnson',
            role: 'Tech Enthusiast',
            avatar: 'https://i.pravatar.cc/150?img=1',
            rating: 5,
            content: 'Absolutely love my new phone case! The quality is outstanding and it fits perfectly. Highly recommend ProductCase to everyone!',
            isActive: true,
        },
    });

    await prisma.testimonial.upsert({
        where: { id: 'testimonial-2' },
        update: {},
        create: {
            id: 'testimonial-2',
            name: 'Michael Chen',
            role: 'Business Professional',
            avatar: 'https://i.pravatar.cc/150?img=12',
            rating: 5,
            content: 'The laptop sleeve is exactly what I needed. Great protection and the extra pockets are super useful for my charger and accessories.',
            isActive: true,
        },
    });

    await prisma.testimonial.upsert({
        where: { id: 'testimonial-3' },
        update: {},
        create: {
            id: 'testimonial-3',
            name: 'Emily Rodriguez',
            role: 'Designer',
            avatar: 'https://i.pravatar.cc/150?img=5',
            rating: 5,
            content: 'Beautiful design and excellent quality. My tablet case is both functional and stylish. Worth every penny!',
            isActive: true,
        },
    });
    console.log('✅ Testimonials created');

    console.log('🎉 Seed completed successfully!');
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    });
