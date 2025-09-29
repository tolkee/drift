import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { Page } from "./page-layout";

function EmptyPage({ className, ...props }: ComponentProps<typeof Page>) {
  return (
    <Page
      className={cn(
        "flex flex-col justify-center items-center w-full h-full flex-grow",
        className,
      )}
      {...props}
    />
  );
}

function EmptyPageContent({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 items-center text-center md:items-start md:text-left ",
        className,
      )}
      {...props}
    />
  );
}

function EmptyPageHeader({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-2 ", className)} {...props} />;
}

function EmptyPageTitle({ className, ...props }: React.ComponentProps<"h1">) {
  return <h1 className={cn("text-2xl font-bold", className)} {...props} />;
}

function EmptyPageDescription({ className, ...props }: ComponentProps<"p">) {
  return (
    <p className={cn("text-sm text-muted-foreground", className)} {...props} />
  );
}

function EmptyPageIcon({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("[&>*]:size-15 mb-5", className)} {...props} />;
}

function EmptyPageActions({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return <div className={cn("mt-10", className)} {...props} />;
}

export {
  EmptyPage,
  EmptyPageIcon,
  EmptyPageTitle,
  EmptyPageDescription,
  EmptyPageContent,
  EmptyPageActions,
  EmptyPageHeader,
};
