import { convexQuery } from "@convex-dev/react-query";
import { api } from "@drift/backend/convex/api";
import { IconCircleCheck, IconCircleDashedCheck } from "@tabler/icons-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { ProjectTag } from "../project-tag";
import type { FullProjectTask } from "./types";

type KanbanTaskProps = {
  task: FullProjectTask;
};

export function KanbanTask({ task }: KanbanTaskProps) {
  const { data: projectTagsRef } = useSuspenseQuery(
    convexQuery(api.projects.queries.getProjectTaskTagsRef, {
      projectId: task.projectId,
    }),
  );

  const tagsWithColors = task.tags.map((tag) => ({
    name: tag,
    color: projectTagsRef.find((t) => t.name === tag)?.color,
  }));

  return (
    <div
      className={cn(
        "w-full min-h-20 bg-accent/60 border p-3 rounded-md flex flex-col gap-3 justify-between cursor-default hover:bg-accent/80 transition-all",
        task.completed && "opacity-40",
      )}
    >
      <div className="flex flex-row item-start gap-2">
        {task.completed ? (
          <IconCircleCheck className="size-5 min-h-5 min-w-5 text-green-600" />
        ) : (
          <Tooltip delayDuration={600}>
            <TooltipTrigger asChild>
              <IconCircleDashedCheck className="size-5 min-h-5 min-w-5 text-muted-foreground/40 hover:text-muted-foreground/70" />
            </TooltipTrigger>
            <TooltipContent>Mark as completed</TooltipContent>
          </Tooltip>
        )}
        <span className="font-medium text-sm line-clamp-2">
          Fix the display of project Kanband
        </span>
      </div>
      {task.tags.length > 0 && (
        <div className="flex items-center gap-2">
          {tagsWithColors.map((tag) => (
            <ProjectTag key={tag.name} color={tag.color}>
              {tag.name}
            </ProjectTag>
          ))}
        </div>
      )}
    </div>
  );
}
