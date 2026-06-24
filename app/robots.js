const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nexprepai.vercel.app";

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
