import { convexQuery } from "@convex-dev/react-query";
import { api } from "@drift/backend/convex/api";
import type { DataModel } from "@drift/backend/convex/dataModel";
import { IconFolder, IconPlus } from "@tabler/icons-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
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
import { ProjectCard } from "@/modules/projects/components/project-card";
import { CreateProjectModal } from "@/modules/projects/modals/create-project-modal";
import { DeleteProjectModal } from "@/modules/projects/modals/delete-project-modal";
import { EditProjectModal } from "@/modules/projects/modals/edit-project-modal";

const BREADCRUMBS = [{ label: "Projects", href: "/projects" }];

export const Route = createFileRoute("/_authed/projects/")({
  component: RouteComponent,
  loader: async ({ context: { queryClient } }) => {
    Promise.all([
      await queryClient.prefetchQuery(
        convexQuery(api.projects.queries.getProjects, {}),
      ),
      await queryClient.prefetchQuery(
        convexQuery(api.projects.queries.getProjectTagsRef, {}),
      ),
    ]);
  },
  validateSearch: z.object({
    createFormOpen: z.boolean().optional(),
  }),
});

function RouteComponent() {
  const { isMobile } = useSidebar();
  const { data: projects } = useSuspenseQuery(
    convexQuery(api.projects.queries.getProjects, {}),
  );

  const [isEditProjectModalOpen, setIsEditProjectModalOpen] = useState(false);
  const [isDeleteAckProjectModalOpen, setIsDeleteAckProjectModalOpen] =
    useState(false);
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] =
    useState(false);
  const [projectBeingInteractedWith, setProjectBeingInteractedWith] = useState<
    DataModel["projects"]["document"] | null
  >(null);

  if (!projects.length)
    return (
      <EmptyPage breadcrumbs={BREADCRUMBS}>
        <EmptyPageContent>
          <EmptyPageIcon>
            <IconFolder />
          </EmptyPageIcon>
          <EmptyPageHeader>
            <EmptyPageTitle>Create your first project</EmptyPageTitle>
            <EmptyPageDescription>
              Projects are the main way to track, organize and work on your life
              goals/projects.
            </EmptyPageDescription>
          </EmptyPageHeader>
          <EmptyPageActions>
            <CreateProjectModal
              open={isCreateProjectModalOpen}
              onOpenChange={setIsCreateProjectModalOpen}
            >
              <Button variant="default" className="w-fit">
                <IconPlus />
                Create Project
              </Button>
            </CreateProjectModal>
          </EmptyPageActions>
        </EmptyPageContent>
      </EmptyPage>
    );

  return (
    <Page breadcrumbs={BREADCRUMBS}>
      <PageSubHeader>
        <CreateProjectModal
          open={isCreateProjectModalOpen}
          onOpenChange={setIsCreateProjectModalOpen}
        >
          <Button variant="outline" size={isMobile ? "xs" : "sm"}>
            <IconPlus />
            <span>Create Project</span>
          </Button>
        </CreateProjectModal>
      </PageSubHeader>

      <div className="flex flex-col gap-2 px-4 py-5 md:px-12 md:py-15">
        <div className="text-sm font-medium text-muted-foreground">
          All projects
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(400px,1fr))] gap-4">
          {projects.map((project) => (
            <ProjectCard
              className="w-full"
              key={project._id}
              project={project}
              onEditProject={(project) => {
                setIsEditProjectModalOpen(true);
                setProjectBeingInteractedWith(project);
              }}
              onDeleteProject={(project) => {
                setIsDeleteAckProjectModalOpen(true);
                setProjectBeingInteractedWith(project);
              }}
            />
          ))}
        </div>
        {projectBeingInteractedWith && (
          <EditProjectModal
            project={projectBeingInteractedWith}
            open={isEditProjectModalOpen}
            onOpenChange={(open) => {
              setIsEditProjectModalOpen(open);
              if (!open) setProjectBeingInteractedWith(null);
            }}
          />
        )}
        {projectBeingInteractedWith && (
          <DeleteProjectModal
            project={projectBeingInteractedWith}
            open={isDeleteAckProjectModalOpen}
            onOpenChange={(open) => {
              setIsDeleteAckProjectModalOpen(open);
              if (!open) setProjectBeingInteractedWith(null);
            }}
          />
        )}
      </div>
    </Page>
  );
}
