export default function manifest() {
  return {
    name: "NexPrep AI — AI Interview Preparation",
    short_name: "NexPrep AI",
    description:
      "Practice AI mock interviews, get instant feedback, check your resume against ATS, and build a recruiter-ready resume.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#F2F4F7",
    theme_color: "#4A6CFF",
    icons: [
      {
        src: "/logo.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/favicon.ico",
        sizes: "48x48",
        type: "image/x-icon",
      },
    ],
  };
}
