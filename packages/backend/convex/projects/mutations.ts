import { v } from "convex/values";
import slugify from "slugify";
import { mutation } from "../_generated/server";
import { getUserId } from "../auth/utils";
import { DEFAULT_COLUMNS } from "./constants";
import { ProjectNotFoundError } from "./errors";
import { getProjectByIdWithAccessGuards } from "./utils";

export const createProject = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    tags: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);

    const slug = slugify(args.name, { lower: true });

    const projectId = await ctx.db.insert("projects", {
      ...args,
      userId,
      slug,
    });

    // create default columns
    const [, doneColumnId] = await Promise.all(
      DEFAULT_COLUMNS.map((column) =>
        ctx.db.insert("columns", {
          ...column,
          projectId: projectId,
        }),
      ),
    );

    // set what column for that project is the done column
    await ctx.db.patch(projectId, {
      doneColumnId,
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
    const project = await getProjectByIdWithAccessGuards(ctx, args.id);

    if (!project) {
      throw new ProjectNotFoundError();
    }

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
    const project = await getProjectByIdWithAccessGuards(ctx, args.id);

    if (!project) {
      throw new ProjectNotFoundError();
    }

    return await ctx.db.delete(project._id);
  },
});

export const addProjectTagRef = mutation({
  args: {
    name: v.string(),
    color: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);

    return await ctx.db.insert("projectTagsRef", {
      ...args,
      userId,
    });
  },
});
