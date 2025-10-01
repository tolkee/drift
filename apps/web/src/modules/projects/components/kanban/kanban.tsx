import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { KanbanColumn } from "./kanban-column";
import type { FullProject } from "./types";

type KanbanProps = {
  fullProject: FullProject;
};

export function Kanban({ fullProject }: KanbanProps) {
  return (
    <ScrollArea className="h-full">
      <div className="flex gap-3 h-full">
        {fullProject.columns.map((column) => (
          <KanbanColumn key={column._id} column={column} />
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
