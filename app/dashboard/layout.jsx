import Header from './_components/Header';

import React from 'react';

export default function Layout({ children }) {
  return (
    <div>
      <Header />
      <div className="mx-5 md:mx-20 lg:mx-36">
        {children}
      </div>
    </div>
  );
}
