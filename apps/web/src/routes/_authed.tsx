import {
  createFileRoute,
  Outlet,
  redirect,
  useNavigate,
} from "@tanstack/react-router";
import z from "zod";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authed")({
  component: RouteComponent,
  validateSearch: z.object({
    ott: z.string().optional(),
  }),
  beforeLoad: async ({ context, search }) => {
    const { user } = context;

    // FIXME: use a callback url for google redirect to support ott, and prevent that condition on ott existing
    // For now, if we remove this, the problem is that google after validating, redirects to / with ott, which would be redirected to sign-in cause still no session
    if (!user && !search.ott) {
      throw redirect({ to: "/sign-in" });
    }
  },
});

function RouteComponent() {
  const navigate = useNavigate();

  return (
    <div>
      <Outlet />

      <Button
        variant="destructive"
        onClick={() => navigate({ to: "/sign-out" })}
      >
        Sign Out
      </Button>
    </div>
  );
}
