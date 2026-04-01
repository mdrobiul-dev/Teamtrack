import { requireAuth } from '@/app/lib/auth';
import { DashboardLayout } from '@/app/components/layout/dashboard-layout';

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAuth();

  return <DashboardLayout user={session}>{children}</DashboardLayout>;
}