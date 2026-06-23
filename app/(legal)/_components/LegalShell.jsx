import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';

/** Shared chrome for static legal pages. */
export default function LegalShell({ title, updated, children }) {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.svg" alt="NexPrep" width={120} height={32} className="h-7 w-auto" />
          </Link>
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-[#4A6CFF] transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to home
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-5 sm:px-8 py-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">{title}</h1>
        {updated && <p className="text-sm text-gray-400 mt-2">Last updated: {updated}</p>}
        <div className="prose-legal mt-8 space-y-6 text-gray-600 leading-relaxed text-[15px]">
          {children}
        </div>
      </main>

      <footer className="border-t border-gray-100 px-5 sm:px-8 py-8 text-center text-sm text-gray-400">
        <div className="flex items-center justify-center gap-6 mb-3">
          <Link href="/privacy" className="hover:text-[#4A6CFF]">Privacy</Link>
          <Link href="/terms" className="hover:text-[#4A6CFF]">Terms</Link>
          <Link href="/auth/sign-in" className="hover:text-[#4A6CFF]">Sign in</Link>
        </div>
        © {new Date().getFullYear()} NexPrep AI
      </footer>
    </div>
  );
}

export function Section({ heading, children }) {
  return (
    <section>
      <h2 className="text-xl font-bold text-gray-900 mb-2">{heading}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}
