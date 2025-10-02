import type { Modifier } from "@dnd-kit/core";
import type { api } from "@drift/backend/convex/api";

export type FullProject = NonNullable<
  typeof api.projects.queries.getFullProject._returnType
>;
export type FullProjectColumn = FullProject["columns"][number];
export type FullProjectTask = FullProjectColumn["tasks"][number];

export type ItemType = "column" | "task";

export type SortableMetadata = {
  type: ItemType;
  modifiers?: Modifier[];
  dragOverlay: () => React.ReactNode;
};
