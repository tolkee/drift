import { convexQuery } from "@convex-dev/react-query";
import { api } from "@drift/backend/convex/api";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation } from "convex/react";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/modules/global-layout/page-layout";

export const Route = createFileRoute("/_authed/projects/")({
  component: RouteComponent,
  pendingComponent: () => <div>Loading...</div>,
  loader: async ({ context: { queryClient } }) => {
    await queryClient.prefetchQuery(
      convexQuery(api.projects.queries.getProjects, {}),
    );
  },
});

function RouteComponent() {
  const { data: projects } = useSuspenseQuery(
    convexQuery(api.projects.queries.getProjects, {}),
  );

  const createProject = useMutation(api.projects.mutations.createProject);
  const deleteProject = useMutation(api.projects.mutations.deleteProject);

  return (
    <PageLayout breadcrumbs={[{ label: "Projects", href: "/projects" }]}>
      <div className="text-center flex flex-col items-center justify-center gap-4">
        {projects.map((project) => (
          <div key={project._id}>
            <Link to="/projects/$slug" params={{ slug: project.slug }}>
              {project.name}
            </Link>
            <button
              type="button"
              className="bg-red-500 text-white p-2 rounded-md"
              onClick={() => deleteProject({ id: project._id })}
            >
              Delete
            </button>
          </div>
        ))}
        <Button
          variant="default"
          onClick={() =>
            createProject({ name: "Test", description: "Test", tags: ["Test"] })
          }
        >
          Create Project
        </Button>
      </div>
    </PageLayout>
  );
}
