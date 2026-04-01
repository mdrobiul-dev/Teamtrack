import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { RegisterForm } from '@/app/components/auth/register-form';
import { getSession } from '@/app/lib/auth';

export const metadata: Metadata = {
  title: 'Register | TaskFlow',
  description: 'Create a new TaskFlow account',
};

export default async function RegisterPage() {
  const session = await getSession();

  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-50 p-4">
      <RegisterForm />
    </div>
  );
}