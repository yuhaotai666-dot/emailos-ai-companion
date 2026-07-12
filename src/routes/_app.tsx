import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { AppSidebar } from "@/components/workspace/AppSidebar";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_app")({
  component: WorkspaceLayout,
});

function WorkspaceLayout() {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      if (!s) navigate({ to: "/auth" });
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (!data.session) navigate({ to: "/auth" });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  if (session === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-sm text-muted-foreground">Loading…</div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen w-full flex bg-background">
      <AppSidebar />
      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  );
}
