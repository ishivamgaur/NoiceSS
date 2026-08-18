import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "NoiceSS - Beautiful Screenshot Mockup Studio",
    short_name: "NoiceSS",
    description: "Create stunning, beautiful screenshot mockups with NoiceSS. Add 3D perspectives, macOS frames, radiant backdrops, and export in high-resolution.",
    start_url: "/",
    display: "standalone",
    background_color: "#09090b",
    theme_color: "#09090b",
    icons: [
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
