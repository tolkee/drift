import type { GenericQueryCtx } from "convex/server";
import type { DataModel, Id } from "../_generated/dataModel";
import { getUserId } from "../auth/utils";

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

/**
 * Get a project by id with ownership guards.
 * @throws ProjectNotFoundError if the project is not found or the user is not the owner of the project.
 */
export async function getProjectByIdWithAccessGuards(
  ctx: GenericQueryCtx<DataModel>,
  id: Id<"projects">,
) {
  const userId = await getUserId(ctx);
  const project = await ctx.db.get(id);

  if (!project || project.userId !== userId) {
    return null;
  }

  return project;
}
