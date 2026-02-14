import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["600", "500", "600"],
  display: "swap",
});

export const metadata = {
  title: "NexPrep AI",
  description: "AI Mock Interview Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={plusJakarta.variable} suppressHydrationWarning>
      <body className="antialiased bg-white text-gray-900 font-sans">
        <Toaster richColors position="top-right" duration={3000} />
        {children}
      </body>
    </html>
  );
}
