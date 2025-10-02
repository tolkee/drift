import type {
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { api } from "@drift/backend/convex/api";
import { useMutation } from "convex/react";
import { useEffect, useState } from "react";
import type {
  FullProject,
  FullProjectColumn,
  FullProjectTask,
  ItemType,
  SortableMetadata,
} from "./types";

function getEventItemType(
  event: DragStartEvent | DragEndEvent | DragOverEvent,
): ItemType | string {
  return event.active.data.current?.type.toLowerCase();
}

export function useKanban(fullProject: FullProject) {
  const [activeItem, setActiveItem] = useState<{
    metadata: SortableMetadata;
    data: FullProjectTask | FullProjectColumn;
  } | null>(null);

  // Sort columns and tasks by rank
  const [localColumnsState, setlocalColumnsState] = useState(
    fullProject.columns
      .sort((a, b) => a.rank - b.rank)
      .map((column) => ({
        ...column,
        tasks: column.tasks.sort((a, b) => a.rank - b.rank),
      })),
  );

  const updateColumnsRanks = useMutation(
    api.projects.mutations.updateColumnsRanks,
  );
  const bulkUpdateTasks = useMutation(api.projects.mutations.bulkUpdateTasks);

  // As localColumnsState is initialized with the fullProject, we need to update it when fullProject changes (e.g., from backend updates)
  useEffect(() => {
    setlocalColumnsState(
      fullProject.columns
        .sort((a, b) => a.rank - b.rank)
        .map((column) => ({
          ...column,
          tasks: column.tasks.sort((a, b) => a.rank - b.rank),
        })),
    );
  }, [fullProject]);

  const handleTaskDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    setlocalColumnsState((prev) => {
      // Find columns using the current state
      const activeColumn = prev.find((col) =>
        col.tasks.some((task) => task._id === activeId),
      );
      const overColumn =
        prev.find((col) => col.tasks.some((task) => task._id === overId)) ||
        prev.find((col) => col._id === overId);

      if (!activeColumn || !overColumn) return prev;

      const activeColIndex = prev.findIndex(
        (col) => col._id === activeColumn._id,
      );
      const overColIndex = prev.findIndex((col) => col._id === overColumn._id);

      const activeTaskIndex = activeColumn.tasks.findIndex(
        (task) => task._id === activeId,
      );
      const overTaskIndex = overColumn.tasks.findIndex(
        (task) => task._id === overId,
      );

      // Moving within same column
      if (activeColIndex === overColIndex) {
        const newColumns = [...prev];
        const newTasks = arrayMove(
          newColumns[activeColIndex].tasks,
          activeTaskIndex,
          overTaskIndex,
        );

        // Update ranks based on new positions
        newColumns[activeColIndex] = {
          ...newColumns[activeColIndex],
          tasks: newTasks.map((task, index) => ({
            ...task,
            rank: index,
          })),
        };
        return newColumns;
      }

      // Moving to different column
      const newColumns = [...prev];
      const [movedTask] = newColumns[activeColIndex].tasks.splice(
        activeTaskIndex,
        1,
      );

      // Create a new task object with updated columnId to avoid mutation
      const updatedMovedTask = {
        ...movedTask,
        columnId: overColumn._id,
      };

      // Update ranks in source column
      newColumns[activeColIndex].tasks = newColumns[activeColIndex].tasks.map(
        (task, index) => ({
          ...task,
          rank: index,
        }),
      );

      // If dropping on a column (not a task), add to end
      if (overId === overColumn._id) {
        newColumns[overColIndex].tasks.push(updatedMovedTask);
      } else {
        newColumns[overColIndex].tasks.splice(
          overTaskIndex,
          0,
          updatedMovedTask,
        );
      }

      // Update ranks in destination column
      newColumns[overColIndex].tasks = newColumns[overColIndex].tasks.map(
        (task, index) => ({
          ...task,
          rank: index,
        }),
      );

      return newColumns;
    });
  };

  const handleTaskDragEnd = (event: DragEndEvent) => {
    setActiveItem(null);

    if (!activeItem) return;

    // we know that the active item is a task (this function is only called for tasks)
    const oldTaskData = activeItem?.data as FullProjectTask;
    const newTaskData = localColumnsState
      .flatMap((column) => column.tasks)
      .find((task) => task._id === event.active.id);

    if (!oldTaskData || !newTaskData) return;

    const hasTaskColumnChanged =
      oldTaskData?.columnId !== newTaskData?.columnId;
    const hasTaskRankChanged = oldTaskData?.rank !== newTaskData?.rank;

    if (!hasTaskColumnChanged && !hasTaskRankChanged) return;

    const currentColumnTaskPatchs =
      localColumnsState
        .find((column) => column._id === newTaskData?.columnId)
        ?.tasks?.map((task) => ({
          id: task._id,
          patch: {
            rank: task.rank,
            columnId: task.columnId,
          },
        })) ?? [];

    // If task column changed, we need to update the previous column tasks ranks and the new column tasks ranks
    if (hasTaskColumnChanged) {
      const previousColumnTasksPatchs =
        localColumnsState
          .find((column) => column._id === oldTaskData?.columnId)
          ?.tasks?.map((task) => ({
            id: task._id,
            patch: {
              rank: task.rank,
              columnId: task.columnId,
            },
          })) ?? [];
      bulkUpdateTasks({
        tasksPatchs: [...previousColumnTasksPatchs, ...currentColumnTaskPatchs],
      });
    } else {
      bulkUpdateTasks({
        tasksPatchs: currentColumnTaskPatchs,
      });
    }
  };

  const handleColumnDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setlocalColumnsState((prev) => {
        const activeIndex = prev.findIndex(
          (column) => column._id === active.id,
        );
        const overIndex = prev.findIndex((column) => column._id === over?.id);
        const newColumns = arrayMove(prev, activeIndex, overIndex).map(
          (column, index) => ({
            ...column,
            rank: index,
          }),
        );

        const columnsWhoRanksHaveChanged = newColumns.filter((column) => {
          const oldColumn = prev.find((c) => c._id === column._id);
          return oldColumn?.rank !== column.rank;
        });

        if (columnsWhoRanksHaveChanged.length > 0) {
          updateColumnsRanks({
            columnsPatchs: columnsWhoRanksHaveChanged.map((column) => ({
              id: column._id,
              rank: column.rank,
            })),
          });
        }

        return newColumns;
      });
    }
    setActiveItem(null);
  };

  const onDragOver = (event: DragOverEvent) => {
    switch (getEventItemType(event)) {
      case "task": {
        return handleTaskDragOver(event);
      }
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    switch (getEventItemType(event)) {
      case "column": {
        return handleColumnDragEnd(event);
      }
      case "task": {
        return handleTaskDragEnd(event);
      }
    }
  };

  const onDragStart = (event: DragStartEvent) => {
    switch (getEventItemType(event)) {
      case "column": {
        const column = localColumnsState.find(
          (column) => column._id === event.active.id,
        );
        if (!column) return;
        setActiveItem({
          metadata: event.active.data.current as SortableMetadata,
          data: column,
        });

        return;
      }
      case "task": {
        const task = localColumnsState
          .flatMap((column) => column.tasks)
          .find((task) => task._id === event.active.id);
        if (!task) return;
        setActiveItem({
          metadata: event.active.data.current as SortableMetadata,
          data: task,
        });

        return;
      }
    }
  };

  return {
    localColumnsState,
    activeItem,
    onDragOver,
    onDragEnd,
    onDragStart,
  };
}
