import { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/app/components/auth/login-form";
import { getSession } from "@/app/lib/auth";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your TaskFlow account",
};

export default async function LoginPage() {
  const session = await getSession();

  if (session) {
    redirect("/workspaces");
  }

  return (
    <div className="min-h-screen w-full bg-[#170e2c] relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-600/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-600/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
      
      <LoginForm />
    </div>
  );
}