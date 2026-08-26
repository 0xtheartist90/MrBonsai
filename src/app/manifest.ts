import type { MetadataRoute } from 'next';

// Makes the app installable on a phone home screen with the proper name and icon
const manifest = (): MetadataRoute.Manifest => ({
    name: 'Mr. Bonsai',
    short_name: 'Mr. Bonsai',
    description: 'Track, care for and grow your bonsai collection',
    start_url: '/',
    display: 'standalone',
    background_color: '#f4f3f1',
    theme_color: '#f4f3f1',
    icons: [
        { src: '/icon.png', sizes: '512x512', type: 'image/png' },
        { src: '/apple-icon.png', sizes: '180x180', type: 'image/png' }
    ]
});

export default manifest;
