"use client";

import type { api } from "@drift/backend/convex/api";
import { IconDotsVertical, IconPlus } from "@tabler/icons-react";
import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ColumnContext,
  ItemContext,
  Kanban,
  KanbanBoard,
  KanbanColumn,
  KanbanColumnContent,
  KanbanItem,
  KanbanItemHandle,
  KanbanOverlay,
} from "@/components/ui/kanban";
import { cn } from "@/lib/utils";

interface Task {
  _id: string;
  name: string;
  description?: string;
  tags: string[];
  userId: string;
  projectId: string;
  completed: boolean;
  columnId: string;
  rank: number;
}

// Column titles will be dynamically set from the project data

interface TaskCardProps
  extends Omit<React.ComponentProps<typeof KanbanItem>, "value" | "children"> {
  task: Task;
  asHandle?: boolean;
}

function TaskCard({ task, asHandle, ...props }: TaskCardProps) {
  const cardContent = (
    <div className="rounded-md border bg-card p-3 shadow-xs">
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between gap-2">
          <span className="line-clamp-1 font-medium text-sm">{task.name}</span>
          {task.completed && (
            <Badge className="pointer-events-none h-5 rounded-sm px-1.5 text-[11px] capitalize shrink-0 bg-green-100 text-green-800">
              Done
            </Badge>
          )}
        </div>
        {task.description && (
          <p className="text-muted-foreground text-xs line-clamp-2">
            {task.description}
          </p>
        )}
        {task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {task.tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-[10px] px-1 py-0"
              >
                {tag}
              </Badge>
            ))}
            {task.tags.length > 3 && (
              <Badge variant="secondary" className="text-[10px] px-1 py-0">
                +{task.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <KanbanItem value={task._id} {...props}>
      {asHandle ? (
        <KanbanItemHandle>{cardContent}</KanbanItemHandle>
      ) : (
        cardContent
      )}
    </KanbanItem>
  );
}

interface TaskColumnProps
  extends Omit<React.ComponentProps<typeof KanbanColumn>, "children"> {
  tasks: Task[];
  columnTitle: string;
  isOverlay?: boolean;
}

function TaskColumn({
  value,
  tasks,
  columnTitle,
  isOverlay,
  className,
  ...props
}: TaskColumnProps) {
  const { isDragging: isColumnDragging } = React.useContext(ColumnContext);
  const { isDragging: isItemDragging } = React.useContext(ItemContext);

  const isDragging = isColumnDragging || isItemDragging;

  return (
    <KanbanColumn
      value={value}
      className={cn(
        "rounded-md border bg-accent/30 p-2.5 shadow-xs md:max-w-90 md:min-w-90 h-full flex-1",
        className,
      )}
      {...props}
    >
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2.5">
          <span className="font-medium text-sm">{columnTitle}</span>
          <span className="text-muted-foreground text-xs">{tasks.length}</span>
        </div>

        <div className="flex items-center">
          <Button size="icon-sm" variant="ghost">
            <IconPlus />
          </Button>
          <Button size="icon-sm" variant="ghost">
            <IconDotsVertical />
          </Button>
        </div>
      </div>
      <KanbanColumnContent value={value} className="flex flex-col gap-4 p-0.5">
        {tasks.map((task) => (
          <TaskCard key={task._id} task={task} asHandle={!isOverlay} />
        ))}
        {!isDragging && (
          <Button
            variant="outline"
            className="hidden group-hover/kanban-column:block w-full "
          >
            <IconPlus className="mx-auto" />
          </Button>
        )}
      </KanbanColumnContent>
    </KanbanColumn>
  );
}

export function ProjectKanban({
  fullProject,
}: {
  fullProject: typeof api.projects.queries.getFullProject._returnType;
}) {
  // Transform fullProject data into kanban format
  const initialColumns = React.useMemo(() => {
    if (!fullProject) return {};

    const columnsData: Record<string, Task[]> = {};

    // Sort columns by rank
    const sortedColumns = [...fullProject.columns].sort(
      (a, b) => a.rank - b.rank,
    );

    // Initialize columns with their tasks
    for (const column of sortedColumns) {
      // Sort tasks by rank within each column
      const sortedTasks = [...column.tasks].sort((a, b) => a.rank - b.rank);
      columnsData[column._id] = sortedTasks;
    }

    return columnsData;
  }, [fullProject]);

  const [columns, setColumns] = React.useState(initialColumns);

  // Create column title mapping
  const columnTitles = React.useMemo(() => {
    if (!fullProject) return {};

    const titles: Record<string, string> = {};
    for (const column of fullProject.columns) {
      titles[column._id] = column.name;
    }
    return titles;
  }, [fullProject]);

  if (!fullProject) return null;

  return (
    <Kanban
      value={columns}
      onValueChange={setColumns}
      getItemValue={(item) => item._id}
      className="h-full"
    >
      <KanbanBoard>
        {Object.entries(columns).map(([columnId, tasks]) => (
          <TaskColumn
            key={columnId}
            value={columnId}
            tasks={tasks}
            columnTitle={columnTitles[columnId] || "Unknown"}
          />
        ))}
      </KanbanBoard>
      <KanbanOverlay>
        <div className="rounded-md bg-muted/60 size-full" />
      </KanbanOverlay>
    </Kanban>
  );
}
