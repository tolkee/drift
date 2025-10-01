import type { api } from "@drift/backend/convex/api";

export type FullProject = NonNullable<
  typeof api.projects.queries.getFullProject._returnType
>;
export type FullProjectColumn = FullProject["columns"][number];
export type FullProjectTask = FullProjectColumn["tasks"][number];
