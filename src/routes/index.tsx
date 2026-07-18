import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

import { supabase } from "@/integrations/supabase/client";
import { cachedOnboarded, fetchOnboarded } from "@/lib/onboarding-status";

export const Route = createFileRoute("/")({
  component: RootRedirect,
});

// Decides /home vs /onboarding entirely on the client: the answer depends on
// the signed-in account's backend profile (plus a localStorage cache), neither
// of which exists during SSR — deciding there would always pick /onboarding.
function RootRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      // OAuth redirects land here with the session token in the URL hash.
      // Supabase consumes it during client init — awaiting getSession forces
      // that init to complete while the hash is still in the URL. Navigating
      // first would strip the hash and lose the login (auth loop).
      await supabase.auth.getSession();
      if (cancelled) return;
      if (cachedOnboarded()) {
        navigate({ to: "/home", replace: true });
        return;
      }
      const onboarded = await fetchOnboarded();
      if (!cancelled) {
        navigate({ to: onboarded ? "/home" : "/onboarding", replace: true });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  return null;
}
