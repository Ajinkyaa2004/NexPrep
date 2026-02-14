"use client";
import React from 'react';
import { Bell, Search, User } from 'lucide-react';

export default function Header() {
  return (
    <div className="flex items-center justify-between px-8 py-5 bg-transparent">
      {/* Search Bar (Optional) */}
      <div className="hidden md:flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-gray-200 w-96 shadow-sm">
        <Search className="text-gray-400 w-5 h-5" />
        <input type="text" placeholder="Search interviews..." className="outline-none text-sm w-full text-gray-700 placeholder:text-gray-400" />
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-6 ml-auto">
        <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>

        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border-2 border-white shadow-md cursor-pointer hover:bg-primary/20 transition-colors">
          <User className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
