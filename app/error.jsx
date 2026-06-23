'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RotateCw, Home } from 'lucide-react';

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error('App error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F2F4F7] px-6 text-center">
      <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-5">
        <AlertTriangle className="w-8 h-8 text-red-500" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900">Something went wrong</h1>
      <p className="text-gray-500 mt-2 max-w-md">
        An unexpected error occurred. You can try again, or head back home.
      </p>
      <div className="flex flex-wrap gap-3 justify-center mt-8">
        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-2 bg-[#4A6CFF] hover:bg-[#3D5CF0] text-white font-semibold px-5 py-2.5 rounded-xl transition-colors"
        >
          <RotateCw className="w-4 h-4" /> Try again
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 font-semibold px-5 py-2.5 rounded-xl hover:border-gray-300 transition-colors"
        >
          <Home className="w-4 h-4" /> Go home
        </Link>
      </div>
    </div>
  );
}
