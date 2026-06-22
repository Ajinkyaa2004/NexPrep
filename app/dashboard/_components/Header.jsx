"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Search, User, LogOut } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { toast } from 'sonner';
import { auth } from '../../../firebase/client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu';

export default function Header() {
  const router = useRouter();
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => setUser(u));
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast.success('Signed out successfully');
      router.push('/auth/sign-in');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out. Please try again.');
    }
  };

  const initial = (user?.displayName?.[0] || user?.email?.[0] || 'U').toUpperCase();

  return (
    <div className="flex items-center justify-between px-8 py-5 bg-transparent">
      {/* Search Bar */}
      <div className="hidden md:flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-gray-200 w-96 shadow-sm focus-within:ring-2 focus-within:ring-primary/30 transition">
        <Search className="text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search interviews..."
          className="outline-none text-sm w-full text-gray-700 placeholder:text-gray-400 bg-transparent"
        />
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-6 ml-auto">
        <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors" aria-label="Notifications">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border-2 border-white shadow-md cursor-pointer hover:bg-primary/20 transition-colors uppercase"
              aria-label="Account menu"
            >
              {user ? initial : <User className="w-5 h-5" />}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="flex flex-col">
              <span className="font-semibold text-gray-800">
                {user?.displayName || (user?.email ? user.email.split('@')[0] : 'Guest User')}
              </span>
              <span className="text-xs text-gray-400 font-normal truncate">
                {user?.email || 'Explore Mode'}
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {user ? (
              <DropdownMenuItem
                onClick={handleSignOut}
                className="text-red-500 focus:text-red-600 focus:bg-red-50 cursor-pointer"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                onClick={() => router.push('/auth/sign-in')}
                className="cursor-pointer"
              >
                <User className="w-4 h-4 mr-2" />
                Sign In
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
