import { IconContrast2Filled } from "@tabler/icons-react";
import { useState } from "react";
import SignInIllustration from "@/assets/signin-illustration.jpg";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

export function SignInForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignInGoogle = async () => {
    setIsLoading(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/oauth-callback",
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex w-full justify-start"></div>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="flex flex-col gap-6 p-10 items-center">
            <div className="flex flex-col items-center text-center">
              <IconContrast2Filled className="!size-10 mb-4" />

              <h1 className="text-2xl font-bold">Welcome to Drift</h1>
              <p className="text-muted-foreground text-balance">
                The Operating System for your life
              </p>
            </div>

            <Button
              variant="outline"
              type="button"
              className="w-full"
              onClick={handleSignInGoogle}
              disabled={isLoading}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                aria-hidden="true"
                aria-label="Google"
              >
                <path
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                  fill="currentColor"
                />
              </svg>
              <span>Login with Google</span>
            </Button>
          </div>
          <div className="bg-muted relative hidden md:block">
            <img
              src={SignInIllustration}
              alt="Drift"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <div className="flex w-full justify-end">
        <div className="h-1 w-10 bg-primary" />
      </div>
    </div>
  );
}
