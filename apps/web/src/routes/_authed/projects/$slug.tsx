import { convexQuery } from "@convex-dev/react-query";
import { api } from "@drift/backend/convex/api";
import { IconArrowLeft, IconFolderOff, IconPlus } from "@tabler/icons-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { Page } from "@/modules/global-layout/page-layout";
import { ProjectKanban } from "@/modules/projects/components/project-kanban";
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
    >
      <CreateColumnModal
        projectId={fullProject._id}
        open={isCreateColumnModalOpen}
        onOpenChange={setIsCreateColumnModalOpen}
        rank={fullProject.columns.length}
      >
        <Button className="mb-6 md:mb-8 w-full md:w-fit">
          <IconPlus />
          Create Column
        </Button>
      </CreateColumnModal>
      <ProjectKanban fullProject={fullProject} />
    </Page>
  );
}
