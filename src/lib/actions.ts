'use server';

import { prisma } from '@/lib/prisma';

export async function getCategories() {
    try {
        const categories = await prisma.category.findMany({
            where: {
                isActive: true,
            },
            include: {
                products: {
                    where: {
                        isActive: true
                    }
                }
            },
            orderBy: {
                name: 'asc'
            }
        });

        return categories.map(cat => ({
            ...cat,
            products: cat.products.map(p => ({
                ...p,
                price: p.price ? p.price.toString() : '—'
            }))
        }));
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
}

export async function getSaleProducts() {
    try {
        const products = await prisma.product.findMany({
            where: {
                isOnSale: true,
                isActive: true
            },
            take: 6,
            select: {
                id: true,
                title: true,
                slug: true,
                mainImage: true,
                price: true,
                salePrice: true,
                discountPercentage: true
            }
        });

        return products.map(product => ({
            ...product,
            price: product.price ? product.price.toString() : '—',
            salePrice: product.salePrice ? product.salePrice.toString() : null
        }));
    } catch (error) {
        console.error('Error fetching sale products:', error);
        return [];
    }
}

export async function getFeaturedProducts() {
    try {
        const products = await prisma.product.findMany({
            where: {
                isFeatured: true,
                isActive: true
            },
            take: 8,
            select: {
                id: true,
                title: true,
                slug: true,
                mainImage: true,
                price: true,
                salePrice: true,
                discountPercentage: true
            }
        });

        return products.map(product => ({
            ...product,
            price: product.price ? product.price.toString() : '—',
            salePrice: product.salePrice ? product.salePrice.toString() : null
        }));
    } catch (error) {
        console.error('Error fetching featured products:', error);
        return [];
    }
}

export async function getTestimonials() {
    try {
        const testimonials = await prisma.testimonial.findMany({
            where: {
                isActive: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return testimonials;
    } catch (error) {
        console.error('Error fetching testimonials:', error);
        return [];
    }
}

export async function getBanners() {
    try {
        const banners = await prisma.banner.findMany({
            where: {
                isActive: true
            },
            orderBy: {
                order: 'asc'
            }
        });

        return banners;
    } catch (error) {
        console.error('Error fetching banners:', error);
        return [];
    }
}
