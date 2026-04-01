import { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/app/components/auth/login-form";
import { getSession } from "@/app/lib/auth";

export const metadata: Metadata = {
  title: "Login | TaskFlow",
  description: "Login to your TaskFlow account",
};

export default async function LoginPage() {
  const session = await getSession();

  
  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-50 p-4">
      <LoginForm />
    </div>
  );
}
