import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
});

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ['400', '600', '700', '800', '900'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: "Fytli - Bouge mieux, vis mieux",
  description: "Ton compagnon sport & bien-être. Des programmes personnalisés, des badges motivants, et une communauté bienveillante pour atteindre tes objectifs fitness.",
  keywords: ["fitness", "sport", "entraînement", "musculation", "bien-être", "santé", "badges", "motivation"],
  authors: [{ name: "Fytli Team" }],
  openGraph: {
    title: "Fytli - Bouge mieux, vis mieux",
    description: "Ton compagnon sport & bien-être pour atteindre tes objectifs",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <head>
        <link rel="icon" href="/logo-fytli.png" />
      </head>
      <body className={`${inter.variable} ${poppins.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}
