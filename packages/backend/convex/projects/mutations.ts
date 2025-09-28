import { v } from "convex/values";
import slugify from "slugify";
import { mutation } from "../_generated/server";
import { getUserId } from "../auth/utils";
import { getProjectByIdWithGuards } from "./utils";

export const createProject = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    tags: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);

    const slug = slugify(args.name, { lower: true });

    return await ctx.db.insert("projects", {
      ...args,
      userId,
      slug,
    });
  },
});

export const updateProject = mutation({
  args: {
    id: v.id("projects"),
    patch: v.object({
      name: v.optional(v.string()),
      description: v.optional(v.string()),
      tags: v.optional(v.array(v.string())),
    }),
  },
  handler: async (ctx, args) => {
    const project = await getProjectByIdWithGuards(ctx, args.id);

    return await ctx.db.patch(project._id, {
      ...args.patch,
      ...(args.patch.name && {
        slug: slugify(args.patch.name, { lower: true }),
      }),
    });
  },
});

export const deleteProject = mutation({
  args: {
    id: v.id("projects"),
  },
  handler: async (ctx, args) => {
    const project = await getProjectByIdWithGuards(ctx, args.id);

    return await ctx.db.delete(project._id);
  },
});
