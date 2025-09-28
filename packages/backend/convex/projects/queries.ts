import { v } from "convex/values";
import { query } from "../_generated/server";
import { getUserId } from "../auth/utils";
import { getProjectByIdWithGuards, getProjectBySlugWithGuards } from "./utils";

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

export const getFullProject = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    const project = await getProjectBySlugWithGuards(ctx, args.slug);

    const [columns, tasks] = await Promise.all([
      ctx.db
        .query("columns")
        .withIndex("by_project", (q) => q.eq("projectId", project._id))
        .collect(),
      ctx.db
        .query("tasks")
        .withIndex("by_project", (q) => q.eq("projectId", project._id))
        .collect(),
    ]);

    return {
      ...project,
      columns: columns.map((column) => ({
        ...column,
        tasks: tasks.filter((task) => task.columnId === column._id),
      })),
    };
  },
});

export const getProjectAvailableFlags = query({
  args: {
    id: v.id("projects"),
  },
  handler: async (ctx, args) => {
    const project = await getProjectByIdWithGuards(ctx, args.id);

    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_project", (q) => q.eq("projectId", project._id))
      .collect();

    const deduplicatedTags = [...new Set(tasks.flatMap((task) => task.tags))];

    return deduplicatedTags;
  },
});
