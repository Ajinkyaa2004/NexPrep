'use client';
import React, { useEffect } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

export default function Header() {
  const path = usePathname();

  useEffect(() => {
    console.log("Current path:", path);
  }, [path]);

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 100, damping: 15 }}
      className="flex items-center bg-secondary shadow-md relative p-2"
    >
      <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
        <Image src="/logo.svg" width={180} height={100} alt="logo" />
      </motion.div>

      <ul className="hidden md:flex gap-6 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        {[
          { path: '/dashboard', label: 'Dashboard' },
          { path: '/dashboard/questions', label: 'Questions' },
          { path: '/dashboard/upgrade', label: 'Upgrade' },
          { path: '/dashboard/how-it-works', label: 'How it Works?' },
        ].map((item, index) => (
          <motion.li
            key={index}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2 }}
            className={`transition-all cursor-pointer text-sm font-medium ${
              path === item.path ? 'text-blue-600 font-bold' : 'text-gray-700'
            } hover:text-blue-600 hover:font-bold`}
          >
            {item.label}
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}
