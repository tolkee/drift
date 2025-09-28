import { v } from "convex/values";
import { query } from "../_generated/server";
import { getUserId } from "../auth/utils";
import { isAllowedToAccessProjectGuard } from "./utils";

export const getProjects = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getUserId(ctx);

    return await ctx.db
      .query("projects")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const getColumns = query({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, args) => {
    await isAllowedToAccessProjectGuard(ctx, args.projectId);

    return await ctx.db
      .query("columns")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect();
  },
});

export const getTasksByProject = query({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, args) => {
    await isAllowedToAccessProjectGuard(ctx, args.projectId);

    return await ctx.db
      .query("tasks")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect();
  },
});

export const getTasksByColumn = query({
  args: {
    columnId: v.id("columns"),
  },
  handler: async (ctx, args) => {
    const column = await ctx.db.get(args.columnId);
    if (!column) {
      throw new Error("Column not found");
    }
    await isAllowedToAccessProjectGuard(ctx, column.projectId);

    return await ctx.db
      .query("tasks")
      .withIndex("by_column", (q) => q.eq("columnId", args.columnId))
      .collect();
  },
});

export const getTasks = query({
  handler: async (ctx) => {
    const userId = await getUserId(ctx);

    return await ctx.db
      .query("tasks")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const getTask = query({
  args: {
    taskId: v.id("tasks"),
  },
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.taskId);
    if (!task) {
      throw new Error("Task not found");
    }
    await isAllowedToAccessProjectGuard(ctx, task.projectId);

    return task;
  },
});

export const getProjectAvailableFlags = query({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, args) => {
    await isAllowedToAccessProjectGuard(ctx, args.projectId);

    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect();

    const deduplicatedTags = [...new Set(tasks.flatMap((task) => task.tags))];

    return deduplicatedTags;
  },
});
