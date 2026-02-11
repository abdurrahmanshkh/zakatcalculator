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
  themeColor: '#0ea5a4',
  openGraph: {
    title: 'Zakat Calculator — Accurate, private & easy',
    description:
      'Calculate Zakat precisely (select your School of Thought). Private — no data leaves your device.',
    url: 'https://yourdomain.example', // <-- replace with your real URL or use env variable
    siteName: 'Zakat Calculator',
    images: ['/logo.png'],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zakat Calculator — Accurate, private & easy',
    description:
      'Calculate Zakat precisely (select your School of Thought). Private — no data leaves your device.',
    images: ['/logo.png'],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/logo.png',
    other: [
      { rel: 'manifest', url: '/manifest.json' },
    ],
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
