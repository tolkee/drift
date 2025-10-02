import { useDroppable } from "@dnd-kit/core";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { DataModel } from "@drift/backend/convex/dataModel";
import { IconDots, IconPlus } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SortableKanbanTask } from "./kanban-task";

type KanbanColumnProps = {
  column: DataModel["columns"]["document"] & {
    tasks: DataModel["tasks"]["document"][];
  };
};

export function SortableKanbanColumn({
  className,
  ...props
}: KanbanColumnProps & React.ComponentProps<"div">) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transition,
    transform,
    isDragging,
  } = useSortable({
    id: props.column._id,
    data: {
      type: "column",
    },
  });
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <KanbanColumn
      ref={setNodeRef}
      style={style}
      {...props}
      {...attributes}
      {...listeners}
      className={cn(isDragging && "opacity-50", className)}
    />
  );
}

export function KanbanColumn({
  column,
  className,
  ...props
}: KanbanColumnProps & React.ComponentProps<"div">) {
  const { setNodeRef } = useDroppable({
    id: column._id,
    data: {
      type: "column",
    },
  });

  return (
    <div
      className={cn(
        "flex flex-col bg-background-secondary p-4 h-full w-85 md:w-100",
        className,
      )}
      {...props}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="font-medium">{column.name}</h2>
          <span className="text-muted-foreground">{column.tasks.length}</span>
        </div>
        <div className="flex items-center">
          <Button size="icon" variant="ghost">
            <IconPlus />
          </Button>
          <Button size="icon" variant="ghost">
            <IconDots />
          </Button>
        </div>
      </div>
      <SortableContext items={column.tasks.map((task) => task._id)}>
        <div
          ref={setNodeRef}
          className={cn(
            "flex flex-col gap-3 h-full group transition-colors rounded-md",
          )}
        >
          {column.tasks.map((task) => (
            <SortableKanbanTask key={task._id} task={task} />
          ))}
          <Button
            variant="outline"
            className="w-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            <IconPlus />
          </Button>
        </div>
      </SortableContext>
    </div>
  );
}
