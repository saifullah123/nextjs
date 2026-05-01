import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Net Gate Western Boutique',
        short_name: 'Net Gate',
        description: 'Premium handcrafted Western show shirts and equestrian gear.',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#d97706', // Amber-600
        icons: [
            {
                src: '/favicon.ico',
                sizes: 'any',
                type: 'image/x-icon',
            },
        ],
    };
}
