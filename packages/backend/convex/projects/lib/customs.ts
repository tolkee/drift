import { v } from "convex/values";
import { customMutation } from "convex-helpers/server/customFunctions";
import { mutation } from "../../_generated/server";
import { isAuthenticatedGuard } from "../../auth/guards";
import {
  hasColumnAccessGuard,
  hasProjectAccessGuard,
  hasTaskAccessGuard,
} from "./guards";

export const projectMutation = customMutation(mutation, {
  args: {
    projectId: v.id("projects"),
  },
  input: async (ctx, args) => {
    const userId = await isAuthenticatedGuard(ctx);
    const project = await hasProjectAccessGuard(ctx, args.projectId);

    return { ctx: { project, userId }, args };
  },
});

export const columnMutation = customMutation(mutation, {
  args: {
    columnId: v.id("columns"),
  },
  input: async (ctx, args) => {
    const userId = await isAuthenticatedGuard(ctx);
    const { column, project } = await hasColumnAccessGuard(ctx, args.columnId);

    return { ctx: { project, column, userId }, args };
  },
});

export const taskMutation = customMutation(mutation, {
  args: {
    taskId: v.id("tasks"),
  },
  input: async (ctx, args) => {
    const userId = await isAuthenticatedGuard(ctx);
    const { task, project } = await hasTaskAccessGuard(ctx, args.taskId);

    return { ctx: { project, task, userId }, args };
  },
});
