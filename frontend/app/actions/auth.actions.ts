"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { authService } from "@/app/services/auth.service";
import type {
  LoginCredentials,
  RegisterCredentials,
  User,
} from "@/app/types/auth";

type AuthFormState = {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// ── Helper: Set auth cookies ─────────────────────────────────────────────────

async function setAuthCookies(response: {
  accessToken: string;
  refreshToken: string;
  user: User;
}) {
  const cookieStore = await cookies();

  const commonOptions = {
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
  };

  cookieStore.set("accessToken", response.accessToken, {
    ...commonOptions,
    httpOnly: true,
    maxAge: 15 * 60, // 15 minutes
  });

  cookieStore.set("refreshToken", response.refreshToken, {
    ...commonOptions,
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
}

// ── Actions ───────────────────────────────────────────────────────────────────

export async function login(
  prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  try {
    const validated = loginSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (!validated.success) {
      return {
        success: false,
        fieldErrors: validated.error.flatten().fieldErrors,
      };
    }

    const response = await authService.login(
      validated.data as LoginCredentials,
    );

    await setAuthCookies(response);

    revalidatePath("/dashboard"); // Optional: refresh protected pages
    return { success: true };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Invalid email or password";
    console.error("Login failed:", error);
    return { success: false, error: message };
  }
}

export async function register(
  prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  try {
    const validated = registerSchema.safeParse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (!validated.success) {
      return {
        success: false,
        fieldErrors: validated.error.flatten().fieldErrors,
      };
    }

    const response = await authService.register(
      validated.data as RegisterCredentials,
    );

    await setAuthCookies(response);

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Registration failed. Please try again.";
    console.error("Registration failed:", error);
    return { success: false, error: message };
  }
}

export async function logout(): Promise<never> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (accessToken) {
      await authService
        .logout()
        .catch((err) => console.warn("Logout API failed:", err));
    }
  } catch (err) {
    console.error("Logout cleanup error:", err);
  } finally {
    const cookieStore = await cookies(); // safe even if previous failed
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");

    revalidatePath("/");
    redirect("/login");
  }
}
