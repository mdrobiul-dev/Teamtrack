"use client";

import { useActionState, useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { login } from "@/app/actions/auth.actions";
import { Input } from "@/app/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/app/components/ui/card";
import {
  Eye,
  EyeOff,
  Loader2,
  Mail,
  Lock,
  ArrowRight,
} from "lucide-react";

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, {
    success: false,
    error: undefined,
    fieldErrors: undefined,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (state.success && formRef.current) {
      formRef.current.reset();
      router.push("/dashboard");
    }
  }, [state.success, router]);

  return (
    <Card className="w-full max-w-md relative z-10 bg-[#1a1140]/80 backdrop-blur-xl border border-white/10 shadow-2xl shadow-purple-900/20 rounded-2xl overflow-hidden">
      <CardHeader className="space-y-1 pb-8 pt-8">
        <div className="flex justify-center mb-4"></div>
        <CardTitle className="text-3xl font-bold text-center text-white">
          Welcome Back
        </CardTitle>
        <CardDescription className="text-center text-gray-400 text-base">
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>

      <form ref={formRef} action={formAction}>
        <CardContent className="space-y-5 px-8">
          {/* Error Message */}
          {state?.error && (
            <div className="p-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div>
                {state.error}
              </div>
            </div>
          )}

          {/* Email Field */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-300"
            >
              Email
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                <Mail className="w-4 h-4" />
              </div>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                autoComplete="email"
                required
                onFocus={() => setIsFocused("email")}
                onBlur={() => setIsFocused(null)}
                className={`pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-600 rounded-xl h-12 transition-all duration-200 ${
                  isFocused === "email"
                    ? "border-purple-500/50 ring-2 ring-purple-500/20 shadow-lg shadow-purple-500/10"
                    : "hover:border-white/20"
                } ${
                  state?.fieldErrors?.email
                    ? "border-red-500/50 ring-2 ring-red-500/20"
                    : ""
                }`}
              />
            </div>
            {state?.fieldErrors?.email && (
              <p className="text-sm text-red-400 flex items-center gap-1.5">
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                {state.fieldErrors.email?.[0]}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-300"
            >
              Password
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                <Lock className="w-4 h-4" />
              </div>
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="current-password"
                required
                onFocus={() => setIsFocused("password")}
                onBlur={() => setIsFocused(null)}
                className={`pl-10 pr-12 bg-white/5 border-white/10 text-white placeholder:text-gray-600 rounded-xl h-12 transition-all duration-200 ${
                  isFocused === "password"
                    ? "border-purple-500/50 ring-2 ring-purple-500/20 shadow-lg shadow-purple-500/10"
                    : "hover:border-white/20"
                } ${
                  state?.fieldErrors?.password
                    ? "border-red-500/50 ring-2 ring-red-500/20"
                    : ""
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors duration-200 focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {state?.fieldErrors?.password && (
              <p className="text-sm text-red-400 flex items-center gap-1.5">
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                {state.fieldErrors.password?.[0]}
              </p>
            )}
          </div>

          {/* Forgot Password & Remember Me */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center space-x-2 cursor-pointer group">
              <input
                type="checkbox"
                name="remember"
                className="w-4 h-4 rounded border-white/20 bg-white/5 text-purple-600 focus:ring-purple-500/50 focus:ring-offset-0 cursor-pointer"
              />
              <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-200">
                Remember me
              </span>
            </label>
            <Link
              href="/forgot-password"
              className="text-sm text-purple-400 hover:text-purple-300 transition-colors duration-200"
            >
              Forgot password?
            </Link>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4 px-8 pb-8 pt-6">
          <button
            type="submit"
            disabled={isPending}
            className="w-full h-12 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 border-0 inline-flex items-center justify-center group"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
              </>
            )}
          </button>

          <p className="text-sm text-gray-400 text-center">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-purple-400 hover:text-purple-300 font-semibold transition-colors duration-200"
            >
              Sign up
            </Link>
          </p>
        </CardFooter>
      </form>

      {/* Bottom decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
    </Card>
  );
}
