import {
  customMutation,
  customQuery,
} from "convex-helpers/server/customFunctions";
import { mutation, query } from "../_generated/server";
import { isAuthenticatedGuard } from "./guards";

export const authenticatedMutation = customMutation(mutation, {
  args: {},
  input: async (ctx) => {
    const userId = await isAuthenticatedGuard(ctx);
    return { ctx: { userId }, args: {} };
  },
});

export const authenticatedQuery = customQuery(query, {
  args: {},
  input: async (ctx) => {
    const userId = await isAuthenticatedGuard(ctx);
    return { ctx: { userId }, args: {} };
  },
});
