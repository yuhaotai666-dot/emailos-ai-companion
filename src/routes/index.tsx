import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      const done = window.localStorage.getItem("emailos_onboarded");
      throw redirect({ to: done === "true" ? "/home" : "/onboarding" });
    }
    throw redirect({ to: "/onboarding" });
  },
});
