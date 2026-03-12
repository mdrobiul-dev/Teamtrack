// app/lib/api.ts
import "server-only";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_API_URL;

if (!BACKEND_URL) {
  throw new Error("BACKEND_API_URL not set in .env");
}

async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    ...options.headers,
  };

  const res = await fetch(`${BACKEND_URL}${path}`, {
    ...options,
    headers,
    credentials: "include", // if backend sets cookies too (rare)
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw {
      success: false,
      message: errorData.message || "API request failed",
      status: res.status,
    };
  }

  return res.json();
}

export const api = {
  get: <T>(path: string, opts?: RequestInit) =>
    apiFetch<T>(path, { method: "GET", ...opts }),
  post: <T>(path: string, body?: unknown, opts?: RequestInit) =>
    apiFetch<T>(path, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
      ...opts,
    }),
  put: <T>(path: string, body?: unknown, opts?: RequestInit) =>
    apiFetch<T>(path, {
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
      ...opts,
    }),
  delete: <T>(path: string, opts?: RequestInit) =>
    apiFetch<T>(path, { method: "DELETE", ...opts }),
};
                               