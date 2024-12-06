'use client';

import dynamic from 'next/dynamic';

const HomeClient = dynamic(() => import('./page-client'), {
  loading: () => <div>Loading application...</div>
});

export default function ClientPage() {
  return (
    <div suppressHydrationWarning>
      <HomeClient />
    </div>
  );
} 