import { v } from "convex/values";
import { query } from "../_generated/server";
import { getUserId } from "../auth/utils";
import { getProjectBySlugWithAccessGuards } from "./utils";

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

export const getProjectById = query({
  args: {
    id: v.id("projects"),
  },
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.id);

    return project;
  },
});

export const getFullProject = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    const project = await getProjectBySlugWithAccessGuards(ctx, args.slug);

    if (!project) {
      return null;
    }

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

export const getProjectTagsRef = query({
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    return await ctx.db
      .query("projectTagsRef")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});
