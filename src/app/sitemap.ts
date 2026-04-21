import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://nextjs-liart-omega-69.vercel.app';

    // Static routes
    const routes = [
        '',
        '/about',
        '/products',
        '/showcase',
        '/contact',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1,
    }));

    // Dynamic products
    let productRoutes: MetadataRoute.Sitemap = [];
    try {
        const { data: products } = await supabase
            .from('Product')
            .select('slug, updatedAt')
            .eq('isActive', true);

        if (products) {
            productRoutes = products.map((product) => ({
                url: `${baseUrl}/products/${product.slug}`,
                lastModified: new Date(product.updatedAt),
                changeFrequency: 'weekly' as const,
                priority: 0.8,
            }));
        }
    } catch (error) {
        console.error('Failed to fetch products for sitemap:', error);
    }

    return [...routes, ...productRoutes];
}
