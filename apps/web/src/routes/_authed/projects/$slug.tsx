import { convexQuery } from "@convex-dev/react-query";
import { api } from "@drift/backend/convex/api";
import { IconArrowLeft, IconFolderOff } from "@tabler/icons-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
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
  const { data: project } = useSuspenseQuery(
    convexQuery(api.projects.queries.getFullProject, {
      slug,
    }),
  );

  if (!project)
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
        { label: project.name, href: `/projects/${project.slug}` },
      ]}
    >
      {JSON.stringify(project)}
    </Page>
  );
}
