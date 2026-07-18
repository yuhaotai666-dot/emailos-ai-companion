// Account-level onboarding status, backed by the backend profile.
// localStorage is only a per-browser cache so returning visits skip the
// network round-trip; the backend is the source of truth, which is what
// makes the flag follow the account across browsers, devices, and domains.
import { req } from "@/lib/api/client";
import type { ApiUserProfile } from "@/lib/api/types";

const CACHE_KEY = "emailos_onboarded";

export function cachedOnboarded(): boolean {
  return typeof window !== "undefined" && window.localStorage.getItem(CACHE_KEY) === "true";
}

/** Backend truth, falling back to "not onboarded" if the backend is down. */
export async function fetchOnboarded(): Promise<boolean> {
  try {
    const profile = await req<ApiUserProfile>("/api/profile");
    const onboarded = profile.onboarded === true;
    if (onboarded && typeof window !== "undefined") {
      window.localStorage.setItem(CACHE_KEY, "true");
    }
    return onboarded;
  } catch {
    return false;
  }
}

/** Persist completion to the account (and the local cache). */
export async function markOnboarded(): Promise<void> {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(CACHE_KEY, "true");
  }
  try {
    const profile = await req<ApiUserProfile>("/api/profile");
    await req<ApiUserProfile>("/api/profile", {
      method: "PUT",
      body: JSON.stringify({ ...profile, onboarded: true }),
    });
  } catch {
    // Backend unreachable — the local cache still unblocks this browser;
    // the flag syncs the next time finish is hit with the backend up.
  }
}
