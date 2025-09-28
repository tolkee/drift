import type { GenericQueryCtx } from "convex/server";
import type { DataModel, Id } from "../_generated/dataModel";
import { getUserId } from "../auth/utils";

export async function isAllowedToAccessProjectGuard(
  ctx: GenericQueryCtx<DataModel>,
  projectId: Id<"projects">,
) {
  const userId = await getUserId(ctx);
  const project = await ctx.db.get(projectId);

  if (!project) {
    throw new Error("Project not found");
  }

  if (project.userId !== userId) {
    throw new Error("Not allowed to access this project");
  }
}
