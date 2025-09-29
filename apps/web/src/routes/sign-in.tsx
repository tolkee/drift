import { createFileRoute, redirect } from "@tanstack/react-router";
import z from "zod";
import { SignInForm } from "@/modules/auth/sign-in-form";

export const Route = createFileRoute("/sign-in")({
  component: RouteComponent,
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

function RouteComponent() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <SignInForm />
      </div>
    </div>
  );
}
