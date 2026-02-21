import { redirect } from 'next/navigation';
import { getSession } from '@/app/actions/auth.actions'; // or '@/app/lib/auth'
import { DashboardLayout } from '@/app/components/layout/dashboard-layout';

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  return <DashboardLayout user={session}>{children}</DashboardLayout>;
}