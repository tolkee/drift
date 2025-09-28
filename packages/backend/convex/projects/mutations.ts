import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { getUserId } from "../auth/utils";

export const createProject = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    tags: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    return await ctx.db.insert("projects", {
      ...args,
      userId,
    });
  },
});

export const updateProject = mutation({
  args: {
    id: v.id("projects"),
    name: v.string(),
    description: v.string(),
    tags: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);

    const project = await ctx.db.get(args.id);

    if (!project) {
      throw new Error("Project not found");
    }

    if (project.userId !== userId) {
      throw new Error("Unauthorized");
    }

    return await ctx.db.patch(args.id, args);
  },
});

export const deleteProject = mutation({
  args: {
    id: v.id("projects"),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);

    const project = await ctx.db.get(args.id);

    if (!project) {
      throw new Error("Project not found");
    }

    if (project.userId !== userId) {
      throw new Error("Unauthorized");
    }

    return await ctx.db.delete(args.id);
  },
});
