import type { GenericMutationCtx, GenericQueryCtx } from "convex/server";
import type { DataModel, Id } from "../../_generated/dataModel";
import { getUserId } from "../../auth/utils";

/**
 * Get a project by slug with ownership guards.
 * @throws ProjectNotFoundError if the project is not found or the user is not the owner of the project.
 */
export async function getProjectBySlugWithAccessGuards(
  ctx: GenericQueryCtx<DataModel>,
  slug: string,
) {
  const userId = await getUserId(ctx);

  const project = await ctx.db
    .query("projects")
    .withIndex("by_slug_user", (q) => q.eq("slug", slug).eq("userId", userId))
    .first();

  return project;
}

export async function remapRanksDueToTaskRankChange({
  ctx,
  projectId,
  columnId,
  newRank,
  taskId,
}: {
  ctx: GenericMutationCtx<DataModel>;
  projectId: Id<"projects">;
  columnId: Id<"columns">;
  taskId: Id<"tasks">;
  newRank: number;
}) {
  const tasks = await ctx.db
    .query("tasks")
    .withIndex("by_project_column", (q) =>
      q.eq("projectId", projectId).eq("columnId", columnId),
    )
    .collect();

  const oldRank = tasks.find((task) => task._id === taskId)?.rank;
  if (!oldRank) {
    return;
  }

  const tasksToDowngradeRanks = tasks.filter(
    (task) => task.rank > oldRank && task.rank <= newRank,
  );

  await Promise.all(
    tasksToDowngradeRanks.map((task) => {
      return ctx.db.patch(task._id, {
        rank: task.rank - 1,
      });
    }),
  );
}

/**
 * Remap the ranks of the tasks in the column due to a task being removed.
 */
export async function remapRanksDueToTaskRemoval({
  ctx,
  projectId,
  columnId,
  taskId,
}: {
  ctx: GenericMutationCtx<DataModel>;
  projectId: Id<"projects">;
  columnId: Id<"columns">;
  taskId: Id<"tasks">;
}) {
  const tasks = await ctx.db
    .query("tasks")
    .withIndex("by_project_column", (q) =>
      q.eq("projectId", projectId).eq("columnId", columnId),
    )
    .collect();

  // take all tasks after the task to be removed and reduce their rank by 1
  const taskRank = tasks.find((task) => task._id === taskId)?.rank;
  if (!taskRank) {
    return;
  }

  const tasksToDowngradeRanks = tasks.filter((task) => task.rank > taskRank);

  await Promise.all(
    tasksToDowngradeRanks.map((task) => {
      return ctx.db.patch(task._id, {
        rank: task.rank - 1,
      });
    }),
  );
}

/**
 * Remap the ranks of the tasks in the column due to a task being added.
 */
export async function remapRanksDueToTaskAddition({
  ctx,
  projectId,
  columnId,
  newRank,
}: {
  ctx: GenericMutationCtx<DataModel>;
  projectId: Id<"projects">;
  columnId: Id<"columns">;
  newRank: number;
}) {
  const tasks = await ctx.db
    .query("tasks")
    .withIndex("by_project_column", (q) =>
      q.eq("projectId", projectId).eq("columnId", columnId),
    )
    .collect();

  const tasksToUpgradeRanks = tasks.filter((task) => task.rank >= newRank);

  await Promise.all(
    tasksToUpgradeRanks.map((task) => {
      return ctx.db.patch(task._id, {
        rank: task.rank + 1,
      });
    }),
  );
}
