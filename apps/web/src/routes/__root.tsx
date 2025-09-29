import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import type { ConvexReactClient } from "convex/react";
import { Toaster } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { authClient } from "@/lib/auth-client";
import { ThemeProvider } from "@/modules/global-layout/theme-provider";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
  convexClient: ConvexReactClient;
}>()({
  component: RootComponent,
  beforeLoad: async () => {
    const session = await authClient.getSession();

    return {
      user: session?.data?.user,
    };
  },
});

function RootComponent() {
  const isMobile = useIsMobile();

  return (
    <ThemeProvider storageKey="vite-ui-theme">
      <div data-vaul-drawer-wrapper="">
        <Outlet />
      </div>
      <Toaster position={isMobile ? "top-center" : "bottom-right"} />
      {/* <TanstackDevtools
        config={{
          position: "bottom-left",
        }}
        plugins={[
          {
            name: "Tanstack Router",
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      /> */}
    </ThemeProvider>
  );
}
