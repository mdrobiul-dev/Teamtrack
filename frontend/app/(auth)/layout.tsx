import type { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#170e2c] flex flex-col relative">
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        {children}
      </main>
      <footer className="py-6 text-center text-sm text-gray-500 relative z-10">
        © {new Date().getFullYear()} TaskFlow. All rights reserved.
      </footer>
    </div>
  );
}