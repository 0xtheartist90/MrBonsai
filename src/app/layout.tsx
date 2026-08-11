import type { ReactNode } from 'react';

import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';

import '@/app/globals.css';
import { BottomNav } from '@/components/bonsai/bottom-nav';
import { BonsaiProvider } from '@/lib/bonsai/store';
import { Toaster } from '@/registry/new-york-v4/ui/sonner';

const geistSans = localFont({
    src: './fonts/GeistVF.woff',
    variable: '--font-geist-sans',
    weight: '100 900'
});
const geistMono = localFont({
    src: './fonts/GeistMonoVF.woff',
    variable: '--font-geist-mono',
    weight: '100 900'
});

export const metadata: Metadata = {
    title: 'Mr. Bonsai',
    description: 'Track, care for and grow your bonsai collection'
};

export const viewport: Viewport = {
    themeColor: '#f4f3f1',
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1
};

const Layout = ({ children }: Readonly<{ children: ReactNode }>) => {
    return (
        <html lang='en'>
            <body
                className={`${geistSans.variable} ${geistMono.variable} bg-background text-foreground overscroll-none antialiased`}>
                <BonsaiProvider>
                    <main className='mx-auto min-h-dvh w-full max-w-md px-4 pt-4 pb-28'>{children}</main>
                    <BottomNav />
                    <Toaster position='top-center' />
                </BonsaiProvider>
            </body>
        </html>
    );
};

export default Layout;
