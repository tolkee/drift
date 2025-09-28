import type { GenericQueryCtx } from "convex/server";
import type { DataModel } from "../_generated/dataModel";
import { authComponent } from "./auth";

export async function getUserId(
  ctx: GenericQueryCtx<DataModel>,
): Promise<string> {
  const user = await authComponent.getAuthUser(ctx);

  if (!user) {
    throw new Error("Unauthorized");
  }

  return user._id;
}
