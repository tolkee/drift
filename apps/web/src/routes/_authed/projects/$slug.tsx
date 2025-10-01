import { convexQuery } from "@convex-dev/react-query";
import { api } from "@drift/backend/convex/api";
import {
  IconArrowLeft,
  IconFilter,
  IconFolderOff,
  IconPlus,
  IconSettings,
} from "@tabler/icons-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { unSlugify } from "@/lib/utils";
import {
  EmptyPage,
  EmptyPageActions,
  EmptyPageContent,
  EmptyPageDescription,
  EmptyPageHeader,
  EmptyPageIcon,
  EmptyPageTitle,
} from "@/modules/global-layout/empty-page";
import { Page, PageSubHeader } from "@/modules/global-layout/page-layout";
import { Kanban } from "@/modules/projects/components/kanban/kanban";
import { CreateColumnModal } from "@/modules/projects/modals/create-column-modal";

export const Route = createFileRoute("/_authed/projects/$slug")({
  component: RouteComponent,
  loader: async ({ context: { queryClient }, params }) => {
    Promise.all([
      await queryClient.prefetchQuery(
        convexQuery(api.projects.queries.getFullProject, {
          slug: params.slug,
        }),
      ),
      await queryClient.prefetchQuery(
        convexQuery(api.projects.queries.getProjectTagsRef, {}),
      ),
    ]);
  },
  errorComponent: ({ error }) => <div>{error.message}</div>,
});

function RouteComponent() {
  const { isMobile } = useSidebar();
  const { slug } = Route.useParams();
  const { data: fullProject } = useSuspenseQuery(
    convexQuery(api.projects.queries.getFullProject, {
      slug,
    }),
  );

  const [isCreateColumnModalOpen, setIsCreateColumnModalOpen] = useState(false);

  if (!fullProject)
    return (
      <EmptyPage
        breadcrumbs={[
          { label: "Projects", href: "/projects" },
          { label: unSlugify(slug), href: `/projects/${slug}` },
        ]}
      >
        <EmptyPageContent>
          <EmptyPageIcon>
            <IconFolderOff />
          </EmptyPageIcon>
          <EmptyPageHeader>
            <EmptyPageTitle>Project not found</EmptyPageTitle>
            <EmptyPageDescription>
              The project you are looking for does not exist. Go back to the
              projects list to see all your projects.
            </EmptyPageDescription>
          </EmptyPageHeader>
          <EmptyPageActions>
            <Link to="/projects">
              <Button>
                <IconArrowLeft />
                Go to back to Projects list
              </Button>
            </Link>
          </EmptyPageActions>
        </EmptyPageContent>
      </EmptyPage>
    );

  return (
    <Page
      breadcrumbs={[
        { label: "Projects", href: "/projects" },
        { label: fullProject.name, href: `/projects/${fullProject.slug}` },
      ]}
      className="flex flex-col p-0 md:p-0"
    >
      <PageSubHeader>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2 md:gap-3">
            <Button variant="outline" size={isMobile ? "xs" : "sm"}>
              <IconPlus />
              <span>Create Column</span>
            </Button>
            <Button variant="ghost" size={isMobile ? "icon-xs" : "sm"}>
              <IconFilter />
              {isMobile ? null : <span>Filter</span>}
            </Button>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <Tooltip delayDuration={600}>
              <TooltipTrigger asChild>
                <Button variant="outline" size={isMobile ? "icon-xs" : "sm"}>
                  <IconSettings />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Project Settings</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </PageSubHeader>
      <CreateColumnModal
        projectId={fullProject._id}
        open={isCreateColumnModalOpen}
        onOpenChange={setIsCreateColumnModalOpen}
        rank={fullProject.columns.length}
      />
      <div className="flex-grow">
        <Kanban fullProject={fullProject} />
      </div>
    </Page>
  );
}
