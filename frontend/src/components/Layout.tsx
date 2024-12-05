'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import Image from 'next/image';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="relative w-10 h-10">
                <Image 
                  src="/logo.png"
                  alt="KoalaKollect"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <span className="ml-2 text-xl font-semibold text-gray-900">
                KoalaKollect
              </span>
            </div>
            <div className="flex items-center">
              <ConnectButton />
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
} 