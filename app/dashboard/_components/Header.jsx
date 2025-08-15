'use client';
import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { auth } from '../../../firebase/client';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { UserIcon, MenuIcon, XIcon } from 'lucide-react';

export default function Header() {
  const path = usePathname();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({
          name: currentUser.displayName || currentUser.email || 'User',
        });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    router.push('/auth/sign-in'); // redirect after logout
  };

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/dashboard/questions', label: 'Questions' },
    { path: '/dashboard/upgrade', label: 'Upgrade' },
    { path: '/dashboard/how-it-works', label: 'How it Works?' },
  ];

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 100, damping: 15 }}
      className="flex items-center justify-between bg-white/90 backdrop-blur-md shadow-md relative p-2 md:px-6"
    >
      {/* Logo */}
      <motion.div whileHover={{ scale: 1.07 }} transition={{ duration: 0.3 }}>
        <img src="/logo.svg" alt="logo" className="w-[160px] h-[80px]" />
      </motion.div>

      {/* Navigation Links - Desktop */}
      <ul className="hidden md:flex gap-6 ml-auto mr-4">
        {navLinks.map((item, index) => (
          <motion.li
            key={index}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2 }}
            className={`relative cursor-pointer text-sm font-medium text-gray-500 tracking-wide ${
              path === item.path ? 'text-blue-600 font-bold' : ''
            } hover:text-blue-600 after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-blue-600 after:left-0 after:bottom-0 after:transition-all after:duration-300 hover:after:w-full`}
          >
            {item.label}
          </motion.li>
        ))}
      </ul>

      {/* Mobile Hamburger */}
      <div className="md:hidden ml-auto">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-md bg-gray-100/80 hover:bg-gray-200 transition-all duration-200"
        >
          {mobileMenuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
        </button>
      </div>

      {/* User Profile Section - Desktop */}
      {user && (
        <div className="hidden md:block relative ml-4">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 bg-gray-100/80 px-3 py-1 rounded-full hover:shadow-md transition-all duration-200"
          >
            <UserIcon className="w-6 h-6 text-gray-700" />
            <span className="text-sm font-medium text-blue-500">{user.name}</span>
          </button>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-36 bg-white shadow-xl rounded-xl py-2 z-50 before:content-[''] before:absolute before:w-3 before:h-3 before:bg-white before:rotate-45 before:top-[-6px] before:right-4"
              >
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-all duration-200"
                >
                  Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg py-4 flex flex-col gap-2 z-40"
          >
            {/* Nav Links */}
            {navLinks.map((item, index) => (
              <li
                key={index}
                className={`px-4 py-2 cursor-pointer text-gray-700 font-medium ${
                  path === item.path ? 'text-blue-600 font-bold' : ''
                } hover:text-blue-600`}
              >
                {item.label}
              </li>
            ))}

            {/* User Section */}
            {user && (
              <div className="border-t border-gray-200 mt-2 pt-2 px-4 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <UserIcon className="w-5 h-5 text-gray-700" />
                  <span className="text-sm font-medium">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-left text-sm text-gray-700 hover:bg-gray-100 px-2 py-1 rounded transition-all duration-200"
                >
                  Logout
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
