import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { getSession } from '@/app/actions/auth.actions'; // or lib/auth
import { DashboardClient } from '@/app/components/dashboard/dashboard-client';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Your personal TaskFlow dashboard',
};

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 md:mb-8">
        Welcome back, {session.name}!
      </h1>

      <Suspense fallback={
        <div className="flex justify-center items-center min-h-[50vh]">
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      }>
        <DashboardClient user={session} />
      </Suspense>
    </div>
  );
}     