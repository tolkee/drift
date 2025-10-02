import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  horizontalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { SortableKanbanColumn } from "./kanban-column";
import type { FullProject } from "./types";
import { useKanban } from "./useKanban";

type KanbanProps = {
  fullProject: FullProject;
};

export function Kanban({ fullProject }: KanbanProps) {
  const { localColumnsState, activeItem, onDragOver, onDragEnd, onDragStart } =
    useKanban(fullProject);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  return (
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      modifiers={activeItem?.metadata?.modifiers ?? []}
    >
      <SortableContext
        items={localColumnsState.map((column) => column._id)}
        strategy={horizontalListSortingStrategy}
      >
        <ScrollArea className="h-full">
          <div className="flex gap-3 h-full">
            {localColumnsState.map((column) => (
              <SortableKanbanColumn key={column._id} column={column} />
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </SortableContext>
      <DragOverlay>{activeItem?.metadata?.dragOverlay()}</DragOverlay>
    </DndContext>
  );
}
