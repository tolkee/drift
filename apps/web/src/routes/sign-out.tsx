import { createFileRoute, redirect } from "@tanstack/react-router";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/sign-out")({
  beforeLoad: async ({ context }) => {
    const { user } = context;
    if (!user) {
      throw redirect({ to: "/sign-in" });
    }

    await authClient.signOut();

    throw redirect({ to: "/sign-in" });
  },
});
