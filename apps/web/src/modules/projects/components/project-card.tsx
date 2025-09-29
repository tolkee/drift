import { convexQuery } from "@convex-dev/react-query";
import { api } from "@drift/backend/convex/api";
import type { DataModel, Id } from "@drift/backend/convex/dataModel";
import { IconDotsVertical, IconPencil, IconTrash } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ProjectCardProps = {
  project: DataModel["projects"]["document"];
  onEditProject: (project: DataModel["projects"]["document"]) => void;
  onDeleteProject: (project: DataModel["projects"]["document"]) => void;
};

export function ProjectCard({
  project,
  onEditProject,
  onDeleteProject,
}: ProjectCardProps) {
  const { data: projectTagsRef } = useQuery(
    convexQuery(api.projects.queries.getProjectTagsRef, {}),
  );

  const tagsWithColors = project.tags?.map((tag) => ({
    name: tag,
    color: projectTagsRef?.find((t) => t.name === tag)?.color,
  }));

  return (
    <Card className="w-full max-w-md hover:border-primary">
      <Link to={`/projects/$slug`} params={{ slug: project.slug }}>
        <CardContent className="">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <h3 className="font-bold">{project.name}</h3>
              <p className="text-sm text-muted-foreground">
                {project.description}
              </p>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <IconDotsVertical />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="right"
                onClick={(e) => e.stopPropagation()}
              >
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
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {tagsWithColors?.map((tag) => (
              <Badge
                key={tag.name}
                variant="secondary"
                style={{ backgroundColor: tag.color }}
              >
                {tag.name}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
