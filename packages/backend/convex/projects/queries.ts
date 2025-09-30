import { v } from "convex/values";
import { authenticatedQuery } from "../auth/customs";
import { getProjectBySlugWithAccessGuards } from "./lib/utils";

export const getProjects = authenticatedQuery({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("projects")
      .withIndex("by_user", (q) => q.eq("userId", ctx.userId))
      .collect();
  },
});

export const getFullProject = authenticatedQuery({
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

export const getProjectTagsRef = authenticatedQuery({
  handler: async (ctx) => {
    return await ctx.db
      .query("projectTagsRef")
      .withIndex("by_user", (q) => q.eq("userId", ctx.userId))
      .collect();
  },
});
