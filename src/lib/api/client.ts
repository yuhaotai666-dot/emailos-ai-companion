// Typed fetch client for the EmailOS AI backend, with graceful fallback.
// When the backend is unreachable the app keeps working on sample data.
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "http://localhost:8000";

export class BackendUnavailable extends Error {}

export async function req<T>(path: string, init?: RequestInit): Promise<T> {
  // The backend scopes every request to the signed-in user via this token.
  // When backend auth is disabled (local dev) the header is simply ignored.
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...((init?.headers as Record<string, string> | undefined) ?? {}),
      },
    });
  } catch {
    throw new BackendUnavailable(`Cannot reach backend at ${BASE}`);
  }
  if (res.status === 401) {
    // Session missing or expired — send the user back through sign-in.
    window.location.href = "/auth";
    throw new Error("401 Unauthorized");
  }
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return (await res.json()) as T;
}

let warnedOffline = false;

/** Run `call`; if the backend is down, return `fallback` (toast shown once). */
export async function withFallback<T>(call: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await call();
  } catch (e) {
    if (e instanceof BackendUnavailable) {
      if (!warnedOffline) {
        warnedOffline = true;
        toast.info("Backend offline — showing sample data");
      }
      return fallback;
    }
    throw e;
  }
}
