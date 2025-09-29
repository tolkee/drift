import { convexQuery } from "@convex-dev/react-query";
import { api } from "@drift/backend/convex/api";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { PageLayout } from "@/modules/global-layout/page-layout";

export const Route = createFileRoute("/_authed/projects/$slug")({
  component: RouteComponent,
  pendingComponent: () => <div>Loading...</div>,
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

  const breadcrumbs = [
    { label: "Projects", href: "/projects" },
    { label: project.name, href: `/projects/${project.slug}` },
  ];

  if (!project)
    return <PageLayout breadcrumbs={breadcrumbs}>Project not found</PageLayout>;

  return (
    <PageLayout breadcrumbs={breadcrumbs}>{JSON.stringify(project)}</PageLayout>
  );
}
