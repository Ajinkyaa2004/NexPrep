const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nexprep.ai";

export default function sitemap() {
  const now = new Date();

  const routes = [
    { path: "/", priority: 1, changeFrequency: "weekly" },
    { path: "/auth/sign-in", priority: 0.8, changeFrequency: "monthly" },
    { path: "/auth/sign-up", priority: 0.8, changeFrequency: "monthly" },
    { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
    { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
  ];

  return routes.map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
