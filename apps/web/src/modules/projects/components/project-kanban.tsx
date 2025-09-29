"use client";

import { IconDotsVertical, IconPlus } from "@tabler/icons-react";
import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  id: string;
  title: string;
  priority: "low" | "medium" | "high";
  description?: string;
  assignee?: string;
  assigneeAvatar?: string;
  dueDate?: string;
}

const COLUMN_TITLES: Record<string, string> = {
  backlog: "Backlog",
  inProgress: "In Progress",
  review: "Review",
  done: "Done",
};

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
          <span className="line-clamp-1 font-medium text-sm">{task.title}</span>
          <Badge className="pointer-events-none h-5 rounded-sm px-1.5 text-[11px] capitalize shrink-0">
            {task.priority}
          </Badge>
        </div>
        <div className="flex items-center justify-between text-muted-foreground text-xs">
          {task.assignee && (
            <div className="flex items-center gap-1">
              <Avatar className="size-4">
                <AvatarImage src={task.assigneeAvatar} />
                <AvatarFallback>{task.assignee.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="line-clamp-1">{task.assignee}</span>
            </div>
          )}
          {task.dueDate && (
            <time className="text-[10px] tabular-nums whitespace-nowrap">
              {task.dueDate}
            </time>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <KanbanItem value={task.id} {...props}>
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
  isOverlay?: boolean;
}

function TaskColumn({
  value,
  tasks,
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
          <span className="font-medium text-sm">{COLUMN_TITLES[value]}</span>
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
          <TaskCard key={task.id} task={task} asHandle={!isOverlay} />
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

export function ProjectKanban() {
  const [columns, setColumns] = React.useState<Record<string, Task[]>>({
    backlog: [
      {
        id: "1",
        title: "Add authentication",
        priority: "high",
        assignee: "John Doe",
        assigneeAvatar: "https://randomuser.me/api/portraits/men/1.jpg",
        dueDate: "Jan 10, 2025",
      },
      {
        id: "2",
        title: "Create API endpoints",
        priority: "medium",
        assignee: "Jane Smith",
        assigneeAvatar: "https://randomuser.me/api/portraits/women/2.jpg",
        dueDate: "Jan 15, 2025",
      },
      {
        id: "3",
        title: "Write documentation",
        priority: "low",
        assignee: "Bob Johnson",
        assigneeAvatar: "https://randomuser.me/api/portraits/men/3.jpg",
        dueDate: "Jan 20, 2025",
      },
    ],
    inProgress: [
      {
        id: "4",
        title: "Design system updates",
        priority: "high",
        assignee: "Alice Brown",
        assigneeAvatar: "https://randomuser.me/api/portraits/women/4.jpg",
        dueDate: "Aug 25, 2025",
      },
      {
        id: "5",
        title: "Implement dark mode",
        priority: "medium",
        assignee: "Charlie Wilson",
        assigneeAvatar: "https://randomuser.me/api/portraits/men/5.jpg",
        dueDate: "Aug 25, 2025",
      },
    ],
    done: [
      {
        id: "7",
        title: "Setup project",
        priority: "high",
        assignee: "Eve Davis",
        assigneeAvatar: "https://randomuser.me/api/portraits/women/6.jpg",
        dueDate: "Sep 25, 2025",
      },
      {
        id: "8",
        title: "Initial commit",
        priority: "low",
        assignee: "Frank White",
        assigneeAvatar: "https://randomuser.me/api/portraits/men/7.jpg",
        dueDate: "Sep 20, 2025",
      },
    ],
  });

  return (
    <Kanban
      value={columns}
      onValueChange={setColumns}
      getItemValue={(item) => item.id}
      className="h-full"
    >
      <KanbanBoard>
        {Object.entries(columns).map(([columnValue, tasks]) => (
          <TaskColumn key={columnValue} value={columnValue} tasks={tasks} />
        ))}
      </KanbanBoard>
      <KanbanOverlay>
        <div className="rounded-md bg-muted/60 size-full" />
      </KanbanOverlay>
    </Kanban>
  );
}
