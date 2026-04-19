import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI Fitness Coach',
  description: 'Real-time AI-powered fitness coaching with form correction',
  keywords: ['fitness', 'AI coach', 'workout', 'form correction', 'pose detection'],
  openGraph: {
    title: 'AI Fitness Coach',
    description: 'Real-time AI-powered fitness coaching with form correction',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-gray-950 text-white antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

