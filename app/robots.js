const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nexprep.ai";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Keep authenticated, user-specific areas out of the index.
        disallow: ["/dashboard", "/dashboard/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
