import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://noicess.vercel.app"),
  title: {
    default: "NoiceSS - Beautiful Screenshot Mockup Studio",
    template: "%s | NoiceSS",
  },
  description: "Create stunning, beautiful screenshot mockups with NoiceSS. Add 3D perspectives, macOS frames, radiant backdrops, and export in high-resolution.",
  keywords: ["noice ss", "noicess", "noice screenshot", "beautiful screenshot noice", "screenshot mockup generator", "3d screenshot", "app presentation maker", "screenshot editor", "macOS frame generator"],
  authors: [{ name: "NoiceSS Team" }],
  creator: "NoiceSS",
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION && {
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    },
  }),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL || "https://noicess.vercel.app",
    title: "NoiceSS - Beautiful Screenshot Mockup Studio",
    description: "Create stunning, beautiful screenshot mockups with NoiceSS. Add 3D perspectives, macOS frames, and radiant backdrops.",
    siteName: "NoiceSS",
    images: [
      {
        url: "/noice-og.webp",
        width: 1200,
        height: 630,
        alt: "NoiceSS Beautiful Screenshot Studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NoiceSS - Beautiful Screenshot Mockup Studio",
    description: "Create stunning, beautiful screenshot mockups with NoiceSS. Add 3D perspectives, macOS frames, and radiant backdrops.",
    images: ["/noice-og.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "NoiceSS",
    "alternateName": ["noice ss", "noicess", "noice screenshot", "beautiful screenshot noice"],
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "Any",
    "description": "Create stunning, beautiful screenshot mockups with NoiceSS. Add 3D perspectives, macOS frames, radiant backdrops, and export in high-resolution.",
    "url": process.env.NEXT_PUBLIC_APP_URL || "https://noicess.vercel.app",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && (
          <Script
            defer
            src="https://cloud.umami.is/script.js"
            data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
          />
        )}
        {children}
      </body>
    </html>
  );
}
