'use client';

import { useRef, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { register } from '@/app/actions/auth.actions';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from '@/app/components/ui/card';
import { Eye, EyeOff, Loader2, Check, X } from 'lucide-react';

function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Creating account...
        </>
      ) : (
        'Create Account'
      )}
    </Button>
  );
}

export function RegisterForm() {
  const [state, formAction] = useFormState(register, { success: false });
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  // Password strength checks
  const hasMinLength = password.length >= 6;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  // Redirect on successful registration
  if (state.success) {
    router.push('/dashboard');
  }

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
        <CardContent className="space-y-4">
          {/* Error Message */}
          {state?.error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
              {state.error}
            </div>
          )}

          {/* Name Field */}
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
              className={state?.fieldErrors?.name ? 'border-red-500 focus-visible:ring-red-500' : ''}
              defaultValue=""
            />
            {state?.fieldErrors?.name && (
              <p className="text-sm text-red-500">{state.fieldErrors.name[0]}</p>
            )}
          </div>

          {/* Email Field */}
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
              className={state?.fieldErrors?.email ? 'border-red-500 focus-visible:ring-red-500' : ''}
              defaultValue=""
            />
            {state?.fieldErrors?.email && (
              <p className="text-sm text-red-500">{state.fieldErrors.email[0]}</p>
            )}
          </div>

          {/* Password Field */}
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
                className={state?.fieldErrors?.password ? 'border-red-500 focus-visible:ring-red-500 pr-10' : 'pr-10'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
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

            {/* Password Strength Indicator */}
            <div className="mt-2 space-y-2">
              <p className="text-xs font-medium text-gray-500">Password requirements:</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-1 text-xs">
                  {hasMinLength ? (
                    <Check className="h-3 w-3 text-green-500" />
                  ) : (
                    <X className="h-3 w-3 text-red-500" />
                  )}
                  <span className={hasMinLength ? 'text-green-600' : 'text-gray-500'}>
                    Min 6 characters
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  {hasUpperCase ? (
                    <Check className="h-3 w-3 text-green-500" />
                  ) : (
                    <X className="h-3 w-3 text-red-500" />
                  )}
                  <span className={hasUpperCase ? 'text-green-600' : 'text-gray-500'}>
                    Uppercase letter
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  {hasLowerCase ? (
                    <Check className="h-3 w-3 text-green-500" />
                  ) : (
                    <X className="h-3 w-3 text-red-500" />
                  )}
                  <span className={hasLowerCase ? 'text-green-600' : 'text-gray-500'}>
                    Lowercase letter
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  {hasNumber ? (
                    <Check className="h-3 w-3 text-green-500" />
                  ) : (
                    <X className="h-3 w-3 text-red-500" />
                  )}
                  <span className={hasNumber ? 'text-green-600' : 'text-gray-500'}>
                    Number
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Terms Agreement */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="terms"
              name="terms"
              required
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="terms" className="text-sm text-gray-600">
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

        <CardFooter className="flex flex-col space-y-4">
          <SubmitButton />
          
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