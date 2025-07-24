'use client';
import React, { useEffect } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Header() {
  const path = usePathname();

  useEffect(() => {
    console.log("Current path:", path);
  }, [path]);

  return (
    <div className="flex items-center bg-secondary shadow-md relative p-2">
      <Image src="/logo.svg" width={180} height={100} alt="logo" />
      <ul className="hidden md:flex gap-5 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <li
          className={`transition-all hover:text-blue-600 hover:font-bold cursor-pointer ${
            path === '/dashboard' ? 'text-blue-600 font-bold' : ''
          }`}
        >
          Dashboard
        </li>
        <li
          className={`transition-all hover:text-blue-600 hover:font-bold cursor-pointer ${
            path === '/dashboard/questions' ? 'text-blue-600 font-bold' : ''
          }`}
        >
          Questions
        </li>
        <li
          className={`transition-all hover:text-blue-600 hover:font-bold cursor-pointer ${
            path === '/dashboard/upgrade' ? 'text-blue-600 font-bold' : ''
          }`}
        >
          Upgrade
        </li>
        <li
          className={`transition-all hover:text-blue-600 hover:font-bold cursor-pointer ${
            path === '/dashboard/how-it-works' ? 'text-blue-600 font-bold' : ''
          }`}
        >
          How it Works?
        </li>
      </ul>
    </div>
  );
}
