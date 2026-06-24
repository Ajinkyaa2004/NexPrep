"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Search, User, LogOut, Settings, Rocket, Flame, CheckCircle2, Trophy, Users, Inbox } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { toast } from 'sonner';
import { auth } from '../../../firebase/client';
import { getIdToken } from '../../../lib/clientAuth';
import { getNotifications } from '../../actions/notifications';
import { getInterviewList } from '../../actions/interview';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu';

const ICONS = { rocket: Rocket, flame: Flame, check: CheckCircle2, trophy: Trophy, users: Users };
const SEEN_KEY = 'nexprep_seen_notifs';

export default function Header() {
  const router = useRouter();
  const [user, setUser] = React.useState(null);
  const [notifs, setNotifs] = React.useState([]);
  const [hasUnseen, setHasUnseen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [allInterviews, setAllInterviews] = React.useState(null);
  const [searchFocused, setSearchFocused] = React.useState(false);

  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
      if (u) loadNotifs();
    });
    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadNotifs = async () => {
    try {
      const token = await getIdToken();
      const list = await getNotifications(token);
      setNotifs(list || []);
      let seen = [];
      try { seen = JSON.parse(localStorage.getItem(SEEN_KEY) || '[]'); } catch {}
      setHasUnseen((list || []).some((n) => !seen.includes(n.id)));
    } catch (e) {
      // non-fatal
    }
  };

  const markSeen = () => {
    try { localStorage.setItem(SEEN_KEY, JSON.stringify(notifs.map((n) => n.id))); } catch {}
    setHasUnseen(false);
  };

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

  const loadInterviews = async () => {
    if (allInterviews !== null) return; // fetch once
    try {
      const token = await getIdToken();
      const list = await getInterviewList(token, { limit: 100 });
      setAllInterviews(list || []);
    } catch {
      setAllInterviews([]);
    }
  };

  const q = query.trim().toLowerCase();
  const results = q
    ? (allInterviews || []).filter((iv) =>
        (iv.jobPosition || '').toLowerCase().includes(q) ||
        (iv.jobDescription || '').toLowerCase().includes(q) ||
        (iv.interviewType || '').toLowerCase().includes(q)
      ).slice(0, 6)
    : [];

  return (
    <div className="flex items-center justify-between px-8 py-5 bg-transparent">
      {/* Search Bar */}
      <div className="hidden md:block relative w-96">
        <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-gray-200 shadow-sm focus-within:ring-2 focus-within:ring-primary/30 transition">
          <Search className="text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={query}
            onFocus={() => { setSearchFocused(true); loadInterviews(); }}
            onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search your interviews..."
            className="outline-none text-sm w-full text-gray-700 placeholder:text-gray-400 bg-transparent"
          />
        </div>
        {searchFocused && q.length > 0 && (
          <div className="absolute z-50 mt-2 w-full bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
            {results.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-gray-400">
                {allInterviews === null ? 'Loading…' : 'No interviews match your search.'}
              </div>
            ) : (
              results.map((iv) => (
                <button
                  key={iv.mockId}
                  onMouseDown={() => router.push(`/dashboard/interview/${iv.mockId}`)}
                  className="w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                >
                  <p className="text-sm font-medium text-gray-800 truncate">{iv.jobPosition}</p>
                  <p className="text-xs text-gray-400 truncate">
                    {iv.interviewType ? `${iv.interviewType} · ` : ''}{iv.selectedDifficulty} · {iv.selectedDuration}
                  </p>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-4 ml-auto">
        {/* Notifications */}
        <DropdownMenu onOpenChange={(open) => { if (open) markSeen(); }}>
          <DropdownMenuTrigger asChild>
            <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors" aria-label="Notifications">
              <Bell className="w-5 h-5" />
              {hasUnseen && <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span className="font-semibold text-gray-800">Notifications</span>
              {notifs.length > 0 && <span className="text-xs text-gray-400">{notifs.length}</span>}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifs.length === 0 ? (
              <div className="px-3 py-8 text-center text-gray-400">
                <Inbox className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm">You're all caught up</p>
              </div>
            ) : (
              notifs.map((n) => {
                const Icon = ICONS[n.icon] || Bell;
                return (
                  <DropdownMenuItem
                    key={n.id}
                    onClick={() => n.href && router.push(n.href)}
                    className="cursor-pointer items-start gap-3 py-2.5"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-800 leading-snug">{n.title}</p>
                      <p className="text-xs text-gray-500 leading-snug mt-0.5">{n.body}</p>
                    </div>
                  </DropdownMenuItem>
                );
              })
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Account */}
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
              <>
                <DropdownMenuItem onClick={() => router.push('/dashboard/settings')} className="cursor-pointer">
                  <Settings className="w-4 h-4 mr-2" /> Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut} className="text-red-500 focus:text-red-600 focus:bg-red-50 cursor-pointer">
                  <LogOut className="w-4 h-4 mr-2" /> Sign Out
                </DropdownMenuItem>
              </>
            ) : (
              <DropdownMenuItem onClick={() => router.push('/auth/sign-in')} className="cursor-pointer">
                <User className="w-4 h-4 mr-2" /> Sign In
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
