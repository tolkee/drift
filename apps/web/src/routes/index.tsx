import { convexQuery } from "@convex-dev/react-query";
import { api } from "@drift/backend/convex/api";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "convex/react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: App,
  pendingComponent: () => <div>Loading...</div>,
});

function App() {
  const { data: projects } = useSuspenseQuery(
    convexQuery(api.projects.queries.getProjects, {}),
  );

  const createProject = useMutation(api.projects.mutations.createProject);
  const deleteProject = useMutation(api.projects.mutations.deleteProject);

  return (
    <div className="text-center flex flex-col items-center justify-center gap-4">
      <h1>Hello World</h1>
      {projects.map((project) => (
        <div key={project._id}>
          {project.name}{" "}
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
        variant="primary"
        onClick={() =>
          createProject({ name: "Test", description: "Test", tags: ["Test"] })
        }
      >
        Create Project
      </Button>
    </div>
  );
}
