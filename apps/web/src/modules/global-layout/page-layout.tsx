import { Link } from "@tanstack/react-router";
import { Fragment } from "react/jsx-runtime";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/modules/global-layout/theme-toggle";

type PageProps = {
  className?: string;
  children?: React.ReactNode;
  breadcrumbs: {
    label: string;
    href?: string;
  }[];
};

export function Page({ children, breadcrumbs, className }: PageProps) {
  const breadcrumbWithoutLast = breadcrumbs.slice(0, -1);
  const lastBreadcrumb = breadcrumbs[breadcrumbs.length - 1];

  return (
    <div className="flex flex-col h-full">
      <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) px-4 lg:px-6">
        <div className="flex w-full items-center gap-1 lg:gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          <h1 className="text-base font-medium">
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbWithoutLast.map((breadcrumb) => (
                  <Fragment key={breadcrumb.href}>
                    <BreadcrumbItem key={breadcrumb.href}>
                      <BreadcrumbLink asChild>
                        <Link to={breadcrumb.href}>{breadcrumb.label}</Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                  </Fragment>
                ))}
                <BreadcrumbItem>
                  <BreadcrumbPage>{lastBreadcrumb.label}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <ModeToggle />
        </div>
      </header>
      <main className={cn(" flex-1", className)}>{children}</main>
    </div>
  );
}

export function PageSubHeader({ children }: { children?: React.ReactNode }) {
  return (
    <div className="border-b h-13 md:h-15 flex gap-3 items-center px-4 md:px-6">
      {children}
    </div>
  );
}
