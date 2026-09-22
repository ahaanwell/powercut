import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PowerCut — Live Power Outage Status by PIN Code",
    short_name: "PowerCut",
    description:
      "Check live, community-reported power cut status for any Indian PIN code, or report an outage in your area.",
    start_url: "/",
    display: "standalone",
    background_color: "#fafafa",
    theme_color: "#172554",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
