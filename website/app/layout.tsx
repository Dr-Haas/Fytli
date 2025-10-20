import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://fytli.app'),
  title: 'Fytli - Seul, mais ensemble | Ton compagnon sport & bien-être',
  description: 'Fytli te motive à t\'entraîner avec tes amis, chacun depuis chez soi. Application gratuite de fitness et bien-être. Crée tes programmes, partage ta progression, reste motivé. Bouge mieux, vis mieux.',
  keywords: [
    'fytli',
    'sport',
    'fitness',
    'motivation',
    'entraînement',
    'communauté',
    'bien-être',
    'application fitness',
    'programme sport',
    'entraînement maison',
    'motivation sportive',
    'coaching gratuit',
    'PWA fitness',
  ],
  authors: [{ name: 'Fytli' }],
  creator: 'Fytli',
  publisher: 'Fytli',
  applicationName: 'Fytli',
  category: 'Fitness & Health',
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://fytli.app',
    siteName: 'Fytli',
    title: 'Fytli - Seul, mais ensemble',
    description: 'Ton compagnon sport & bien-être gratuit. Entraîne-toi avec tes amis, chacun depuis chez soi. Bouge mieux, vis mieux.',
    images: [
      {
        url: '/assets/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Fytli - Application de fitness et bien-être',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@fytli_app',
    creator: '@fytli_app',
    title: 'Fytli - Seul, mais ensemble',
    description: 'Ton compagnon sport & bien-être gratuit. Entraîne-toi avec tes amis, chacun depuis chez soi.',
    images: ['/assets/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0A0A0A',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

