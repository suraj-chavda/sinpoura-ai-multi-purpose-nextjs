import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const paths = [
    { path: "/", priority: 1, changeFrequency: "weekly" as const },
    { path: "/login", priority: 0.4, changeFrequency: "monthly" as const },
    { path: "/register", priority: 0.4, changeFrequency: "monthly" as const },
  ];
  return paths.map(({ path, priority, changeFrequency }) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));
}
