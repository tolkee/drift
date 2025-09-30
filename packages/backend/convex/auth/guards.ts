import type { GenericMutationCtx, GenericQueryCtx } from "convex/server";
import type { DataModel } from "../_generated/dataModel";
import { NotAuthenticatedError } from "./errors";
import { getUserId } from "./utils";

export async function isAuthenticatedGuard(
  ctx: GenericQueryCtx<DataModel> | GenericMutationCtx<DataModel>,
) {
  const userId = await getUserId(ctx);
  if (!userId) throw new NotAuthenticatedError();
  return userId;
}
