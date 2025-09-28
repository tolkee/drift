import { createFileRoute, redirect } from "@tanstack/react-router";
import z from "zod";

export const Route = createFileRoute("/oauth-callback")({
  validateSearch: z.object({
    ott: z.string().optional(),
  }),
  beforeLoad: async ({ search }) => {
    const { ott } = search;
    if (!ott) {
      throw redirect({ to: "/" });
    }
  },
});
