import { Link } from "@tanstack/react-router";
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

type PageLayoutProps = {
  children: React.ReactNode;
  breadcrumbs: {
    label: string;
    href?: string;
  }[];
};

export function PageLayout({ children, breadcrumbs }: PageLayoutProps) {
  const breadcrumbWithoutLast = breadcrumbs.slice(0, -1);
  const lastBreadcrumb = breadcrumbs[breadcrumbs.length - 1];

  return (
    <div>
      <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
        <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          <h1 className="text-base font-medium">
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbWithoutLast.map((breadcrumb) => (
                  <>
                    <BreadcrumbItem key={breadcrumb.href}>
                      <BreadcrumbLink asChild>
                        <Link to={breadcrumb.href}>{breadcrumb.label}</Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                  </>
                ))}
                <BreadcrumbItem>
                  <BreadcrumbPage>{lastBreadcrumb.label}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </h1>
        </div>
      </header>
      <main className="p-4">{children}</main>
    </div>
  );
}
