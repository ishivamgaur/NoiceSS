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
  title: "NOICESS - Pro Screenshot & Mockup Studio",
  description: "Create stunning screenshot mockups with 3D perspectives, macOS frames, radiant backdrops, and multi-resolution exports.",
  verification: {
    google: "fc97ca20fc908ab7",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <meta name="google-site-verification" content="fc97ca20fc908ab7" />
      </head>
      <body>
        <Script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="67628db1-54ae-4324-8bec-8959f6fff94c"
        />
        {children}
      </body>
    </html>
  );
}
