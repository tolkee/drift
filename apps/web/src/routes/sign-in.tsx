import { createFileRoute, redirect } from "@tanstack/react-router";
import z from "zod";
import { SignInForm } from "@/components/forms/sign-in-form";

export const Route = createFileRoute("/sign-in")({
  component: SignInForm,
  validateSearch: z.object({
    redirectTo: z.string().optional(),
  }),
  beforeLoad: async ({ context, search }) => {
    const { user } = context;
    if (user) {
      throw redirect({ to: search.redirectTo ?? "/" });
    }
  },
});
