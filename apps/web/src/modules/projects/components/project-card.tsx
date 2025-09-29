import { convexQuery } from "@convex-dev/react-query";
import { api } from "@drift/backend/convex/api";
import type { DataModel } from "@drift/backend/convex/dataModel";
import { IconDotsVertical, IconPencil, IconTrash } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ProjectTag } from "./project-tag";

function ProjectCard({
  project,
  onEditProject,
  onDeleteProject,
  ...props
}: ComponentProps<typeof ProjectCardWrapper> & {
  project: DataModel["projects"]["document"];
  onEditProject: (project: DataModel["projects"]["document"]) => void;
  onDeleteProject: (project: DataModel["projects"]["document"]) => void;
}) {
  return (
    <ProjectCardWrapper key={project._id} {...props}>
      <Link to={`/projects/$slug`} params={{ slug: project.slug }}>
        <ProjectCardMenu
          project={project}
          onEditProject={onEditProject}
          onDeleteProject={onDeleteProject}
        />
        <ProjectCardContent>
          <ProjectCardHeader>
            <ProjectCardName>{project.name}</ProjectCardName>
            <ProjectCardDescription>
              {project.description}
            </ProjectCardDescription>
          </ProjectCardHeader>

          <ProjectCardTags tags={project.tags} />
        </ProjectCardContent>
      </Link>
    </ProjectCardWrapper>
  );
}

function ProjectCardPreview({
  project,
  ...props
}: ComponentProps<typeof ProjectCardWrapper> & {
  project: Partial<
    Pick<DataModel["projects"]["document"], "name" | "description" | "tags">
  >;
}) {
  return (
    <ProjectCardWrapper {...props}>
      <ProjectCardContent>
        <ProjectCardHeader>
          <ProjectCardName>
            {project.name || "Untitled Project"}
          </ProjectCardName>
          <ProjectCardDescription>
            {project.description || "No description"}
          </ProjectCardDescription>
        </ProjectCardHeader>
        <ProjectCardTags tags={project.tags || []} />
      </ProjectCardContent>
    </ProjectCardWrapper>
  );
}

function ProjectCardContent({
  className,
  ...props
}: ComponentProps<typeof CardContent>) {
  return (
    <CardContent className={cn("flex flex-col gap-2", className)} {...props} />
  );
}

function ProjectCardWrapper({
  className,
  ...props
}: ComponentProps<typeof Card>) {
  return (
    <Card
      className={cn("w-full max-w-lg hover:border-primary relative", className)}
      {...props}
    />
  );
}

function ProjectCardHeader({ className, ...props }: ComponentProps<"div">) {
  return <div className="flex flex-col" {...props} />;
}

function ProjectCardName({ className, ...props }: ComponentProps<"h3">) {
  return <h3 className={cn("font-bold", className)} {...props} />;
}

function ProjectCardDescription({ className, ...props }: ComponentProps<"p">) {
  return (
    <p className={cn("text-sm text-muted-foreground", className)} {...props} />
  );
}

function ProjectCardMenu({
  project,
  onEditProject,
  onDeleteProject,
}: {
  project: DataModel["projects"]["document"];
  onEditProject: (project: DataModel["projects"]["document"]) => void;
  onDeleteProject: (project: DataModel["projects"]["document"]) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="absolute top-3 right-4">
          <IconDotsVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" onClick={(e) => e.stopPropagation()}>
        <DropdownMenuItem onClick={() => onEditProject(project)}>
          <IconPencil />
          Edit
        </DropdownMenuItem>

        <DropdownMenuItem
          variant="destructive"
          onClick={() => onDeleteProject(project)}
        >
          <IconTrash />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ProjectCardTags({ tags }: { tags: string[] }) {
  const { data: projectTagsRef } = useQuery(
    convexQuery(api.projects.queries.getProjectTagsRef, {}),
  );

  const tagsWithColors = tags?.map((tag) => ({
    name: tag,
    color: projectTagsRef?.find((t) => t.name === tag)?.color,
  }));

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {tagsWithColors?.map((tag) => (
        <ProjectTag key={tag.name} color={tag.color}>
          {tag.name}
        </ProjectTag>
      ))}
    </div>
  );
}

export {
  ProjectCardWrapper,
  ProjectCardMenu,
  ProjectCard,
  ProjectCardPreview,
  ProjectCardTags,
  ProjectCardContent,
  ProjectCardHeader,
  ProjectCardName,
  ProjectCardDescription,
};
