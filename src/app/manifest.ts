import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Product Case Shop',
        short_name: 'ProductCase',
        description: 'Premium quality cases for your products',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#9333ea', // Purple-600
        icons: [
            {
                src: '/favicon.ico',
                sizes: 'any',
                type: 'image/x-icon',
            },
        ],
    };
}
