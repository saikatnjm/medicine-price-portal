import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: "BD Healthcare",
    description: siteConfig.description,
    start_url: "/",
    display: "browser",
    background_color: "#ffffff",
    theme_color: "#0f766e",
    icons: [{ src: "/icon.svg", type: "image/svg+xml", sizes: "any" }],
  };
}
