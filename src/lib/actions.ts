'use server';

import { supabase } from '@/lib/supabase';

export async function getCategories() {
    try {
        const { data: categories, error } = await supabase
            .from('Category')
            .select(`
                id,
                name,
                slug,
                description,
                Product (
                    id,
                    title,
                    slug,
                    price,
                    mainImage,
                    isFeatured,
                    status,
                    isActive
                )
            `)
            .eq('isActive', true)
            .eq('Product.isActive', true)
            .order('name', { ascending: true });

        if (error) {
            console.error('Error fetching categories from Supabase:', error);
            return [];
        }

        // Return categories with their products formatted
        return (categories || []).map(cat => ({
            ...cat,
            products: (cat.Product as any[] || []).map(p => ({
                ...p,
                price: p.price.toString()
            }))
        }));
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
}

export async function getFeaturedProducts() {
    try {
        const { data: products, error } = await supabase
            .from('Product')
            .select('id, title, slug, mainImage, price')
            .eq('isFeatured', true)
            .eq('isActive', true)
            .limit(4);

        if (error) {
            console.error('Error fetching featured products from Supabase:', error);
            return [];
        }

        return (products || []).map(product => ({
            ...product,
            price: product.price.toString()
        }));
    } catch (error) {
        console.error('Error fetching featured products:', error);
        return [];
    }
}

export async function getTestimonials() {
    try {
        const { data: testimonials, error } = await supabase
            .from('Testimonial')
            .select('*')
            .eq('isActive', true)
            .order('createdAt', { ascending: false });

        if (error) {
            console.error('Error fetching testimonials from Supabase:', error);
            return [];
        }

        return testimonials || [];
    } catch (error) {
        console.error('Error fetching testimonials:', error);
        return [];
    }
}

export async function getBanners() {
    try {
        const { data: banners, error } = await supabase
            .from('Banner')
            .select('*')
            .eq('isActive', true)
            .order('order', { ascending: true });

        if (error) {
            console.error('Error fetching banners from Supabase:', error);
            return [];
        }

        return banners || [];
    } catch (error) {
        console.error('Error fetching banners:', error);
        return [];
    }
}
