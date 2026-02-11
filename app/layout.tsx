// app/layout.tsx
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

/**
 * Base URL used to resolve og/twitter image URLs.
 * Set NEXT_PUBLIC_SITE_URL in your environment to your production URL.
 */
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

/**
 * Export metadataBase so Next can resolve relative image paths correctly.
 * Next will use this to build absolute URLs for Open Graph / Twitter images.
 */
export const metadataBase = new URL(SITE_URL);

export const metadata: Metadata = {
  title: {
    default: 'Zakat Calculator — Accurate, private & easy',
    template: '%s | Zakat Calculator',
  },
  description:
    'Accurate, private and easy-to-use Zakat calculator — choose your School of Thought and calculate quickly.',
  keywords: [
    'zakat calculator',
    'zakat',
    'islamic finance',
    'nisab',
    'zakat calculation',
    'zakat calculator app',
  ],
  applicationName: 'Zakat Calculator',
  authors: [{ name: 'Abdur Rehman Shaikh' }],
  creator: 'Abdur Rehman Shaikh',
  robots: {
    index: true,
    follow: true,
    nocache: false,
  },
  // <-- Removed `themeColor` from metadata to avoid the warning.
  // Add theme-color as a meta tag in app/head.tsx (see snippet below).
  openGraph: {
    title: 'Zakat Calculator — Accurate, private & easy',
    description:
      'Calculate Zakat precisely (select your School of Thought). Private — no data leaves your device.',
    // Use absolute URL for OG image
    url: SITE_URL,
    siteName: 'Zakat Calculator',
    images: [`${SITE_URL}/logo.png`], // absolute URL
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zakat Calculator — Accurate, private & easy',
    description:
      'Calculate Zakat precisely (select your School of Thought). Private — no data leaves your device.',
    images: [`${SITE_URL}/logo.png`], // absolute URL
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/logo.png',
    other: [{ rel: 'manifest', url: '/manifest.json' }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
