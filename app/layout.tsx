import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'
import { Analytics } from "@vercel/analytics/next"

// NOTE: This is a Client Component, but it's safe to render in a Server file.
// We don't call hooks here; we just mount the provider.

export const metadata: Metadata = {
  title: 'A day in the life of a pixelated boy',
  description: 'A simple web game that teaches cause & effect with short dilemmas.',
  keywords: ['game', 'interactive fiction', 'choices', 'consequences'],
  authors: [{ name: 'Ben Ogren', url: 'https://www.benogren.com' }],
  creator: 'Ben Ogren',
  publisher: 'Ben Ogren',
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: 'https://pixelated-boy.vercel.app/icon1.png',
  },
  manifest: 'https://pixelated-boy.vercel.app/manifest.json',
  openGraph: {
    title: 'A day in the life of a pixelated boy',
    description: 'A simple web game that teaches cause & effect with short dilemmas.',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: 'https://pixelated-boy.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'A day in the life of a pixelated boy',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'A day in the life of a pixelated boy',
    description: 'A simple web game that teaches cause & effect with short dilemmas.',
    images: ['https://pixelated-boy.vercel.app/og-image.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh text-gray-900 antialiased">
        <div className="relative min-h-dvh bg-circuit">
          <div className="mx-auto">
            <main className="flex h-screen items-center justify-center">
              <div className=''>
                {children}
                <Analytics />
              </div>
            </main>
            {/* <footer className="px-4 py-8 text-xs text-gray-500 border-t mt-10">
              No accounts. No personal data. Game state lives on your device.
              <Link href="/about" className="hover:underline">About</Link>
                <Link href="/privacy" className="hover:underline">Privacy</Link>
            </footer> */}
          </div>
        </div>
      </body>
    </html>
  )
}