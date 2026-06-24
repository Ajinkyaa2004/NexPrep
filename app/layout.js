import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nexprepai.vercel.app";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "NexPrep AI — Ace Your Next Interview with AI Mock Interviews",
    template: "%s | NexPrep AI",
  },
  description:
    "NexPrep AI is an AI-powered interview preparation platform. Practice realistic mock interviews, get instant feedback and scoring, check your resume against ATS systems, and build a recruiter-ready resume — powered by Gemini AI.",
  applicationName: "NexPrep AI",
  keywords: [
    "AI mock interview",
    "interview preparation",
    "AI interview practice",
    "ATS resume checker",
    "resume builder",
    "job interview practice",
    "interview questions",
    "AI feedback",
    "technical interview prep",
    "NexPrep",
  ],
  authors: [{ name: "NexPrep AI" }],
  creator: "NexPrep AI",
  publisher: "NexPrep AI",
  category: "education",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "NexPrep AI",
    title: "NexPrep AI — Ace Your Next Interview with AI Mock Interviews",
    description:
      "Practice realistic AI mock interviews, get instant feedback, check your resume against ATS, and build a recruiter-ready resume.",
  },
  twitter: {
    card: "summary_large_image",
    title: "NexPrep AI — Ace Your Next Interview with AI",
    description:
      "AI mock interviews, instant feedback, ATS resume checker, and a resume builder — all in one platform.",
    creator: "@nexprep",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/logo.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: "/logo.svg",
  },
  manifest: "/manifest.webmanifest",
};

export const viewport = {
  themeColor: "#4A6CFF",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "NexPrep AI",
  applicationCategory: "EducationalApplication",
  operatingSystem: "Web",
  description:
    "AI-powered interview preparation platform with mock interviews, instant feedback, an ATS resume checker, and a resume builder.",
  url: siteUrl,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={plusJakarta.variable} suppressHydrationWarning>
      <body className="antialiased bg-white text-gray-900 font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Toaster richColors position="top-right" duration={3000} />
        {children}
      </body>
    </html>
  );
}
