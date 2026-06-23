import Link from 'next/link';
import { Compass, Home } from 'lucide-react';

export const metadata = {
  title: 'Page not found',
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F2F4F7] px-6 text-center">
      <div className="w-16 h-16 rounded-full bg-[#4A6CFF]/10 flex items-center justify-center mb-5">
        <Compass className="w-8 h-8 text-[#4A6CFF]" />
      </div>
      <p className="text-5xl font-extrabold text-gray-900">404</p>
      <h1 className="text-xl font-bold text-gray-800 mt-2">Page not found</h1>
      <p className="text-gray-500 mt-2 max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <div className="flex flex-wrap gap-3 justify-center mt-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-[#4A6CFF] hover:bg-[#3D5CF0] text-white font-semibold px-5 py-2.5 rounded-xl transition-colors"
        >
          <Home className="w-4 h-4" /> Back to home
        </Link>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 font-semibold px-5 py-2.5 rounded-xl hover:border-gray-300 transition-colors"
        >
          Go to dashboard
        </Link>
      </div>
    </div>
  );
}
