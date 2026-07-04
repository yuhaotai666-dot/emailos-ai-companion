// Typed fetch client for the EmailOS AI backend, with graceful fallback.
// When the backend is unreachable the app keeps working on sample data.
import { toast } from "sonner";

const BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "http://localhost:8000";

export class BackendUnavailable extends Error {}

export async function req<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...init,
    });
  } catch {
    throw new BackendUnavailable(`Cannot reach backend at ${BASE}`);
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
