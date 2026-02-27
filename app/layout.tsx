import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AnvilWP - AI-Powered WordPress Theme Generator',
  description: 'Generate professional, portable WordPress themes in minutes. No lock-in, just beautiful code.',
  openGraph: {
    title: 'AnvilWP - Forge Your Perfect WordPress Theme',
    description: 'AI-powered theme generator that creates professional WordPress themes you can use anywhere.',
    url: 'https://anvilwp.com',
    siteName: 'AnvilWP',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AnvilWP - AI-Powered WordPress Theme Generator',
    description: 'Generate professional WordPress themes in minutes',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
