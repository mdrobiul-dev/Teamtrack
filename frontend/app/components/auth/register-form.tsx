"use client";

import { useActionState, useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { register } from "@/app/actions/auth.actions";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/app/components/ui/card";
import { Eye, EyeOff, Loader2, Check, X, User, Mail, Lock } from "lucide-react";

export function RegisterForm() {
  // Modern React 19 API
  const [state, formAction, isPending] = useActionState(register, {
    success: false,
    error: undefined,
    fieldErrors: undefined,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [isFocused, setIsFocused] = useState<string | null>(null);

  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  // Password strength checks
  const hasMinLength = password.length >= 6;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const strengthScore = [
    hasMinLength,
    hasUpperCase,
    hasLowerCase,
    hasNumber,
  ].filter(Boolean).length;

  const getStrengthLabel = () => {
    if (strengthScore === 0)
      return { text: "Very Weak", color: "bg-red-500", width: "0%" };
    if (strengthScore === 1)
      return { text: "Weak", color: "bg-red-500", width: "25%" };
    if (strengthScore === 2)
      return { text: "Fair", color: "bg-orange-500", width: "50%" };
    if (strengthScore === 3)
      return { text: "Good", color: "bg-yellow-500", width: "75%" };
    return { text: "Strong", color: "bg-green-500", width: "100%" };
  };

  const strength = getStrengthLabel();

  // Handle success: reset form + redirect
  useEffect(() => {
    if (state.success && formRef.current) {
      formRef.current.reset();
      router.push("/dashboard");
    }
  }, [state.success, router]);

  return (
    <Card className="w-full max-w-md relative z-10 bg-[#1a1140]/80 backdrop-blur-xl border border-white/10 shadow-2xl shadow-purple-900/20 rounded-2xl overflow-hidden">
      <CardHeader className="space-y-1 pb-8 pt-8">
        <CardTitle className="text-3xl font-bold text-center text-white">
          Create Account
        </CardTitle>
        <CardDescription className="text-center text-gray-400 text-base">
          Join us and start your journey
        </CardDescription>
      </CardHeader>

      <form ref={formRef} action={formAction}>
        <CardContent className="space-y-5 px-8">
          {/* Server error */}
          {state?.error && (
            <div className="p-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div>
                {state.error}
              </div>
            </div>
          )}

          {/* Name */}
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-gray-300">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                <User className="w-4 h-4" />
              </div>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                autoComplete="name"
                required
                onFocus={() => setIsFocused("name")}
                onBlur={() => setIsFocused(null)}
                className={`pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-600 rounded-xl h-12 transition-all duration-200 ${
                  isFocused === "name"
                    ? "border-purple-500/50 ring-2 ring-purple-500/20 shadow-lg shadow-purple-500/10"
                    : "hover:border-white/20"
                } ${
                  state?.fieldErrors?.name
                    ? "border-red-500/50 ring-2 ring-red-500/20"
                    : ""
                }`}
              />
            </div>
            {state?.fieldErrors?.name && (
              <p className="text-sm text-red-400 flex items-center gap-1.5">
                <X className="w-3.5 h-3.5" />
                {state.fieldErrors.name[0]}
              </p>
            )}
          </div>

          {/* Email */}
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
                <X className="w-3.5 h-3.5" />
                {state.fieldErrors.email[0]}
              </p>
            )}
          </div>

          {/* Password with toggle + strength */}
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
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                <X className="w-3.5 h-3.5" />
                {state.fieldErrors.password[0]}
              </p>
            )}

            {/* Enhanced strength indicator */}
            {password && (
              <div className="mt-4 space-y-3">
                {/* Strength bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium text-gray-500">
                      Password strength
                    </span>
                    <span
                      className={`text-xs font-semibold ${
                        strengthScore <= 1
                          ? "text-red-400"
                          : strengthScore === 2
                            ? "text-orange-400"
                            : strengthScore === 3
                              ? "text-yellow-400"
                              : "text-green-400"
                      }`}
                    >
                      {strength.text}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${strength.color} transition-all duration-500 ease-out rounded-full`}
                      style={{ width: strength.width }}
                    ></div>
                  </div>
                </div>

                {/* Requirements checklist */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center ${
                        hasMinLength ? "bg-green-500/20" : "bg-gray-800"
                      }`}
                    >
                      {hasMinLength ? (
                        <Check className="w-3 h-3 text-green-400" />
                      ) : (
                        <X className="w-3 h-3 text-gray-600" />
                      )}
                    </div>
                    <span
                      className={
                        hasMinLength ? "text-green-400" : "text-gray-600"
                      }
                    >
                      6+ characters
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center ${
                        hasUpperCase ? "bg-green-500/20" : "bg-gray-800"
                      }`}
                    >
                      {hasUpperCase ? (
                        <Check className="w-3 h-3 text-green-400" />
                      ) : (
                        <X className="w-3 h-3 text-gray-600" />
                      )}
                    </div>
                    <span
                      className={
                        hasUpperCase ? "text-green-400" : "text-gray-600"
                      }
                    >
                      Uppercase
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center ${
                        hasLowerCase ? "bg-green-500/20" : "bg-gray-800"
                      }`}
                    >
                      {hasLowerCase ? (
                        <Check className="w-3 h-3 text-green-400" />
                      ) : (
                        <X className="w-3 h-3 text-gray-600" />
                      )}
                    </div>
                    <span
                      className={
                        hasLowerCase ? "text-green-400" : "text-gray-600"
                      }
                    >
                      Lowercase
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center ${
                        hasNumber ? "bg-green-500/20" : "bg-gray-800"
                      }`}
                    >
                      {hasNumber ? (
                        <Check className="w-3 h-3 text-green-400" />
                      ) : (
                        <X className="w-3 h-3 text-gray-600" />
                      )}
                    </div>
                    <span
                      className={hasNumber ? "text-green-400" : "text-gray-600"}
                    >
                      Number
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Terms checkbox */}
          <div className="flex items-start space-x-3 pt-2">
            <div className="relative">
              <input
                type="checkbox"
                id="terms"
                name="terms"
                required
                className="peer sr-only"
              />
              <div
                className="w-5 h-5 border border-white/20 rounded-md peer-checked:bg-gradient-to-r peer-checked:from-purple-600 peer-checked:to-indigo-600 peer-checked:border-transparent transition-all duration-200 cursor-pointer flex items-center justify-center"
                onClick={() => {
                  const checkbox = document.getElementById(
                    "terms",
                  ) as HTMLInputElement;
                  if (checkbox) checkbox.checked = !checkbox.checked;
                }}
              >
                <Check className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
              </div>
            </div>
            <label
              htmlFor="terms"
              className="text-sm text-gray-400 leading-relaxed select-none cursor-pointer"
            >
              I agree to the{" "}
              <Link
                href="/terms"
                className="text-purple-400 hover:text-purple-300 transition-colors duration-200"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="text-purple-400 hover:text-purple-300 transition-colors duration-200"
              >
                Privacy Policy
              </Link>
            </label>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4 px-8 pb-8 pt-6">
          <button
            type="submit"
            disabled={isPending}
            className="w-full h-12 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 border-0"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </button>

          <p className="text-sm text-gray-400 text-center">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-purple-400 hover:text-purple-300 font-semibold transition-colors duration-200"
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </form>

      {/* Bottom decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
    </Card>
  );
}
