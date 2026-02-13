'use server';

import { supabase } from '@/lib/supabase';

export async function getCategories() {
    try {
        const { data: categories, error } = await supabase
            .from('Category')
            .select('id, name, slug, description')
            .eq('isActive', true)
            .order('name', { ascending: true });

        if (error) {
            console.error('Error fetching categories from Supabase:', error);
            return [];
        }

        return categories || [];
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

        // Convert price to string for client components if needed
        return (products || []).map(product => ({
            ...product,
            price: product.price.toString()
        }));
    } catch (error) {
        console.error('Error fetching featured products:', error);
        return [];
    }
}
