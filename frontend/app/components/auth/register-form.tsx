'use client';

import { useActionState, useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { register } from '@/app/actions/auth.actions';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/app/components/ui/card';
import { Eye, EyeOff, Loader2, Check, X } from 'lucide-react';

export function RegisterForm() {
  // Modern React 19 API
  const [state, formAction, isPending] = useActionState(register, {
    success: false,
    error: undefined,
    fieldErrors: undefined,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');

  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  // Password strength checks
  const hasMinLength = password.length >= 6;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  // Handle success: reset form + redirect
  useEffect(() => {
    if (state.success && formRef.current) {
      formRef.current.reset();
      router.push('/dashboard');
    }
  }, [state.success, router]);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Create an Account
        </CardTitle>
        <CardDescription className="text-center">
          Enter your information to get started
        </CardDescription>
      </CardHeader>

      <form ref={formRef} action={formAction}>
        <CardContent className="space-y-5">
          {/* Server error */}
          {state?.error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
              {state.error}
            </div>
          )}

          {/* Name */}
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Full Name
            </label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="John Doe"
              autoComplete="name"
              required
              className={
                state?.fieldErrors?.name
                  ? 'border-red-500 focus-visible:ring-red-500'
                  : ''
              }
            />
            {state?.fieldErrors?.name && (
              <p className="text-sm text-red-500">{state.fieldErrors.name[0]}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              autoComplete="email"
              required
              className={
                state?.fieldErrors?.email
                  ? 'border-red-500 focus-visible:ring-red-500'
                  : ''
              }
            />
            {state?.fieldErrors?.email && (
              <p className="text-sm text-red-500">{state.fieldErrors.email[0]}</p>
            )}
          </div>

          {/* Password with toggle + strength */}
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Password
            </label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={
                  state?.fieldErrors?.password
                    ? 'border-red-500 focus-visible:ring-red-500 pr-10'
                    : 'pr-10'
                }
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            {state?.fieldErrors?.password && (
              <p className="text-sm text-red-500">{state.fieldErrors.password[0]}</p>
            )}

            {/* Strength indicator */}
            {password && (
              <div className="mt-3 space-y-2">
                <p className="text-xs font-medium text-gray-500">
                  Password strength:
                </p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                  <div className="flex items-center gap-1.5">
                    {hasMinLength ? (
                      <Check className="h-3.5 w-3.5 text-green-500" />
                    ) : (
                      <X className="h-3.5 w-3.5 text-red-500" />
                    )}
                    <span className={hasMinLength ? 'text-green-700' : 'text-gray-600'}>
                      At least 6 characters
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {hasUpperCase ? (
                      <Check className="h-3.5 w-3.5 text-green-500" />
                    ) : (
                      <X className="h-3.5 w-3.5 text-red-500" />
                    )}
                    <span className={hasUpperCase ? 'text-green-700' : 'text-gray-600'}>
                      Uppercase letter
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {hasLowerCase ? (
                      <Check className="h-3.5 w-3.5 text-green-500" />
                    ) : (
                      <X className="h-3.5 w-3.5 text-red-500" />
                    )}
                    <span className={hasLowerCase ? 'text-green-700' : 'text-gray-600'}>
                      Lowercase letter
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {hasNumber ? (
                      <Check className="h-3.5 w-3.5 text-green-500" />
                    ) : (
                      <X className="h-3.5 w-3.5 text-red-500" />
                    )}
                    <span className={hasNumber ? 'text-green-700' : 'text-gray-600'}>
                      Number
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Terms checkbox */}
          <div className="flex items-start space-x-2 pt-1">
            <input
              type="checkbox"
              id="terms"
              name="terms"
              required
              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed">
              I agree to the{' '}
              <Link href="/terms" className="text-blue-600 hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-blue-600 hover:underline">
                Privacy Policy
              </Link>
            </label>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4 pt-2">
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </Button>

          <p className="text-sm text-gray-600 text-center">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}