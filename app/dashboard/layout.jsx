import React from 'react';
import Sidebar from './_components/Sidebar';
import Header from './_components/Header';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <div className="hidden md:block w-72 fixed inset-y-0 z-50">
        <Sidebar />
      </div>

      <div className="md:ml-72">
        <Header />
        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
