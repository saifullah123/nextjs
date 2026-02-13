'use server';

import { prisma } from '@/lib/prisma';

export async function getCategories() {
    try {
        const categories = await prisma.category.findMany({
            where: { isActive: true },
            orderBy: { name: 'asc' },
            select: {
                id: true,
                name: true,
                slug: true,
                description: true,
            }
        });
        return categories;
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
}

export async function getFeaturedProducts() {
    try {
        const products = await prisma.product.findMany({
            where: { isFeatured: true, isActive: true },
            take: 4, // Increased to 4 to match the 2x2 grid in the mega menu
            select: {
                id: true,
                title: true,
                slug: true,
                mainImage: true,
                price: true,
            }
        });

        // Convert Decimal to number/string for client components
        return products.map(product => ({
            ...product,
            price: product.price.toString()
        }));
    } catch (error) {
        console.error('Error fetching featured products:', error);
        return [];
    }
}
