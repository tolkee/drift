import { Route } from "@/routes/_authed";

export function useUser() {
  const { user } = Route.useRouteContext();

  if (!user) {
    throw new Error("useUser must be used within a _authed route");
  }

  return user;
}
