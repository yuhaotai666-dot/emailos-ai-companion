import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Welcome — EmailOS AI" },
      { name: "description", content: "Set up your personal AI email assistant in a few calm steps." },
      { property: "og:title", content: "Welcome to EmailOS AI" },
      { property: "og:description", content: "A calm setup for your personal AI email assistant." },
    ],
  }),
  component: () => <Outlet />,
});
