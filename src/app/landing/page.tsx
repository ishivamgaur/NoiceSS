import type { Metadata, Viewport } from "next";
import Landing from "./Landing";

export const metadata: Metadata = {
  title: "NoiceSS - beautiful screenshot mockups in 3D",
  description:
    "Turn a plain screenshot into a beautiful app mockup. Real 3D perspective, macOS frames, studio lighting and 4K export. Free, open source, runs in your browser.",
  alternates: {
    canonical: "/landing",
  },
  openGraph: {
    title: "NoiceSS - beautiful screenshot mockups in 3D",
    description:
      "Real 3D perspective, macOS frames, studio lighting and 4K export. Free, open source, runs in your browser.",
    url: "/landing",
    images: [{ url: "/noice-og.webp", width: 1200, height: 630, alt: "NoiceSS screenshot mockup studio" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#09090b",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function LandingPage() {
  return <Landing />;
}
