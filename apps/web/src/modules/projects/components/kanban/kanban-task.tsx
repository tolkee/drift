import { convexQuery } from "@convex-dev/react-query";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { api } from "@drift/backend/convex/api";
import { IconCircleCheck, IconCircleDashedCheck } from "@tabler/icons-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMutation } from "convex/react";
import { Button } from "@/components/ui/button";
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

export function SortableKanbanTask(
  props: KanbanTaskProps & React.ComponentProps<"div">,
) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transition,
    transform,
    isDragging,
  } = useSortable({
    id: props.task._id,
    data: {
      type: "task",
      dragOverlay: () => (
        <KanbanTask task={props.task} className="cursor-grabbing" />
      ),
    },
  });
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <KanbanTask
      ref={setNodeRef}
      style={style}
      {...props}
      {...attributes}
      {...listeners}
      isPlaceholder={isDragging}
    />
  );
}

export function KanbanTask({
  task,
  className,
  isPlaceholder,
  ...props
}: KanbanTaskProps &
  React.ComponentProps<"div"> & { isPlaceholder?: boolean }) {
  const { data: projectTagsRef } = useSuspenseQuery(
    convexQuery(api.projects.queries.getProjectTaskTagsRef, {
      projectId: task.projectId,
    }),
  );
  const toggleTaskCompletion = useMutation(
    api.projects.mutations.toggleTaskCompletion,
  );

  const tagsWithColors = task.tags.map((tag) => ({
    name: tag,
    color: projectTagsRef.find((t) => t.name === tag)?.color,
  }));

  return (
    <div
      className={cn(
        "w-full min-h-20 border p-3 rounded-md transition-all cursor-default bg-background-tertiary hover:bg-background-tertiary-hover relative",
        isPlaceholder && "bg-background-tertiary/40",
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          "flex flex-col gap-3 justify-between w-full h-full",
          task.completed && "opacity-30",
          isPlaceholder && "opacity-0",
        )}
      >
        <div className="flex flex-row items-start gap-1">
          <Tooltip delayDuration={600}>
            <TooltipTrigger asChild>
              <Button
                variant="link"
                size="icon-xs"
                onClick={() => toggleTaskCompletion({ taskId: task._id })}
                className="h-fit"
              >
                {task.completed ? (
                  <IconCircleCheck className="size-5 min-h-5 min-w-5 text-green-600" />
                ) : (
                  <IconCircleDashedCheck className="size-5 min-h-5 min-w-5 text-muted-foreground/40 hover:text-muted-foreground/70" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {task.completed ? "Mark as incomplete" : "Mark as completed"}
            </TooltipContent>
          </Tooltip>
          <span className="font-medium text-sm line-clamp-2 h-fit">
            {task.name}
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
    </div>
  );
}
