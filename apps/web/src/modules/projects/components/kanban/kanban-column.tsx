import type { DataModel } from "@drift/backend/convex/dataModel";
import { IconDots, IconPlus } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { KanbanTask } from "./kanban-task";

type KanbanColumnProps = {
  column: DataModel["columns"]["document"] & {
    tasks: DataModel["tasks"]["document"][];
  };
};

export function KanbanColumn({ column }: KanbanColumnProps) {
  return (
    <div className="flex flex-col bg-accent/30 p-4 h-full w-85 md:w-100">
      <div className="flex items-center justify-between">
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
      <div className="flex flex-col gap-3 mt-4 h-full group">
        {column.tasks.map((task) => (
          <KanbanTask key={task._id} task={task} />
        ))}
        <Button
          variant="outline"
          className="w-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          <IconPlus />
        </Button>
      </div>
    </div>
  );
}
