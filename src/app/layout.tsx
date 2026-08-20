import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from 'sonner';
import { Analytics } from '@vercel/analytics/react';
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
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://noicess.fun"),
  applicationName: "NoiceSS",
  appleWebApp: {
    title: "NoiceSS",
    statusBarStyle: "black-translucent",
    capable: true,
  },
  title: {
    default: "NoiceSS - Beautiful Screenshot Mockup Studio",
    template: "%s | NoiceSS",
  },
  description: "Create stunning, beautiful screenshot mockups with NoiceSS. Add 3D perspectives, macOS frames, radiant backdrops, and export in high-resolution.",
  keywords: [
    "noice ss", "noicess", "noice screenshot", "beautiful screenshot noice", 
    "beautiful ss", "beautiful screenshot", "noice", "noice.ss", "noicess app",
    "screenshot mockup generator", "3d screenshot", "app presentation maker", 
    "screenshot editor", "macOS frame generator", "aesthetic screenshot mockup",
    "stunning screenshot", "glassmorphism screenshot", "beautiful screenshot maker",
    "best screenshot editor", "beautiful UI presentation", "clean screenshot editor",
    "free screenshot tool", "twitter screenshot generator", "product hunt screenshot maker", 
    "browser mockup", "window mockup", "image beautifier", "screenshot backgrounds",
    "Shivam Gaur", "ishivamgaur", "Shivam Gaur developer", "Shivam Gaur portfolio",
    "noiceSS Shivam Gaur", "full-stack developer Noida", "shivamgaur.space"
  ],
  authors: [{ name: "Shivam Gaur", url: "https://shivamgaur.space" }],
  creator: "Shivam Gaur",
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION && {
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    },
  }),
  alternates: {
    canonical: process.env.NEXT_PUBLIC_APP_URL || "https://noicess.fun",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL || "https://noicess.fun",
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
    creator: "@ishivgaur",
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
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "NoiceSS",
      "alternateName": [
        "noice ss", "noicess", "noice screenshot", "beautiful screenshot noice", 
        "beautiful ss", "beautiful screenshot", "noice", "noice.ss", 
        "aesthetic screenshot generator", "screenshot mockup generator"
      ],
      "applicationCategory": "MultimediaApplication",
      "operatingSystem": "Any",
      "description": "Create stunning, beautiful screenshot mockups with NoiceSS. Add 3D perspectives, macOS frames, radiant backdrops, and export in high-resolution. 100% free and open-source.",
      "url": process.env.NEXT_PUBLIC_APP_URL || "https://noicess.fun",
      "sameAs": [
        "https://github.com/ishivamgaur/noiceSS",
        "https://twitter.com/ishivgaur",
        "https://linkedin.com/in/ishivamgaur",
        "https://instagram.com/ishivamgaur"
      ],
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "@id": `${process.env.NEXT_PUBLIC_APP_URL || "https://noicess.fun"}/#person`,
      "name": "Shivam Gaur",
      "alternateName": "@ishivamgaur",
      "url": "https://shivamgaur.space",
      "jobTitle": "Full Stack Developer",
      "description": "Shivam Gaur is a full-stack developer in Noida, India, building web products with React, Next.js, Node.js, TypeScript, and MongoDB.",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Noida",
        "addressRegion": "Uttar Pradesh",
        "addressCountry": "IN"
      },
      "sameAs": [
        "https://github.com/ishivamgaur",
        "https://linkedin.com/in/ishivamgaur",
        "https://twitter.com/ishivgaur",
        "https://instagram.com/ishivamgaur"
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to create a beautiful 3D screenshot mockup",
      "description": "Learn how to turn a standard screenshot into a stunning, beautiful 3D app presentation using NoiceSS.",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Upload Screenshot",
          "text": "Paste or upload your raw app screenshot into the NoiceSS editor."
        },
        {
          "@type": "HowToStep",
          "name": "Add macOS Frame & 3D Perspective",
          "text": "Enable the macOS window frame and adjust the 3D tilt sliders to give your image depth."
        },
        {
          "@type": "HowToStep",
          "name": "Apply Radiant Backdrop",
          "text": "Select a glassmorphism background and adjust the studio lighting."
        },
        {
          "@type": "HowToStep",
          "name": "Export High Resolution",
          "text": "Click export to download a 2x or 4x high-resolution WebP image for your portfolio or Product Hunt launch."
        }
      ]
    }
  ];

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
        />
        <link rel="alternate" type="application/rss+xml" href="/feed.xml" title="NoiceSS RSS Feed" />
        <link rel="author" type="text/plain" href="/humans.txt" />
        <link rel="alternate" type="text/plain" href="/llms.txt" title="LLM-friendly site summary" />
        <link rel="alternate" type="text/plain" href="/ai.txt" title="AI usage preferences" />
      </head>
      <body suppressHydrationWarning>
        {process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && (
          <Script
            defer
            src="https://cloud.umami.is/script.js"
            data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
          />
        )}
        <Toaster position="bottom-center" theme="dark" richColors toastOptions={{ style: { background: 'rgba(20, 20, 20, 0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff' } }} />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
