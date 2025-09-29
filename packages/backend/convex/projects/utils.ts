import type { GenericQueryCtx } from "convex/server";
import type { DataModel, Id } from "../_generated/dataModel";
import { getUserId } from "../auth/utils";
import { ProjectNotFoundError } from "./errors";

/**
 * Get a project by slug with ownership guards.
 * @throws ProjectNotFoundError if the project is not found or the user is not the owner of the project.
 */
export async function getProjectBySlugWithGuards(
  ctx: GenericQueryCtx<DataModel>,
  slug: string,
) {
  const userId = await getUserId(ctx);

  const project = await ctx.db
    .query("projects")
    .withIndex("by_slug_user", (q) => q.eq("slug", slug).eq("userId", userId))
    .first();

  if (!project) {
    throw new ProjectNotFoundError();
  }

  return project;
}

/**
 * Get a project by id with ownership guards.
 * @throws ProjectNotFoundError if the project is not found or the user is not the owner of the project.
 */
export async function getProjectByIdWithGuards(
  ctx: GenericQueryCtx<DataModel>,
  id: Id<"projects">,
) {
  const userId = await getUserId(ctx);
  const project = await ctx.db.get(id);

  if (!project || project.userId !== userId) {
    throw new ProjectNotFoundError();
  }

  return project;
}
