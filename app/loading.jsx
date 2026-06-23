import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F2F4F7] gap-3">
      <Loader2 className="w-8 h-8 animate-spin text-[#4A6CFF]" />
      <p className="text-sm text-gray-500">Loading…</p>
    </div>
  );
}
