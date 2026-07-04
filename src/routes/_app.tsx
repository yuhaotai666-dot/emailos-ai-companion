import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppSidebar } from "@/components/workspace/AppSidebar";

export const Route = createFileRoute("/_app")({
  component: WorkspaceLayout,
});

function WorkspaceLayout() {
  return (
    <div className="min-h-screen w-full flex bg-background">
      <AppSidebar />
      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  );
}
