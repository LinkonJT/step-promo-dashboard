import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Step Group Portal",
    short_name: "Step Portal",
    description: "Live updates for Step Group operations",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#B31419",
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icon.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
  };
}