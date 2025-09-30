import type { GenericMutationCtx, GenericQueryCtx } from "convex/server";
import type { DataModel, Id } from "../../_generated/dataModel";
import { getUserId } from "../../auth/utils";
import { NotAllowedToAccessProjectError, NotFoundError } from "./errors";

export async function hasProjectAccessGuard(
  ctx: GenericQueryCtx<DataModel> | GenericMutationCtx<DataModel>,
  projectId: Id<"projects">,
) {
  const userId = await getUserId(ctx);

  const project = await ctx.db.get(projectId);
  if (!project || project.userId !== userId)
    throw new NotAllowedToAccessProjectError();

  return project;
}

export async function hasColumnAccessGuard(
  ctx: GenericQueryCtx<DataModel> | GenericMutationCtx<DataModel>,
  columnId: Id<"columns">,
) {
  const column = await ctx.db.get(columnId);
  if (!column) throw new NotFoundError({ columnId });

  const project = await hasProjectAccessGuard(ctx, column.projectId);

  return { column, project };
}

export async function hasTaskAccessGuard(
  ctx: GenericQueryCtx<DataModel> | GenericMutationCtx<DataModel>,
  taskId: Id<"tasks">,
) {
  const task = await ctx.db.get(taskId);
  if (!task) throw new NotFoundError({ taskId });

  const project = await hasProjectAccessGuard(ctx, task.projectId);

  return { task, project };
}
