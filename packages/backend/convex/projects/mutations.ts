import { v } from "convex/values";
import slugify from "slugify";
import { api } from "../_generated/api";
import { authenticatedMutation } from "../auth/customs";
import { DEFAULT_COLUMNS } from "./lib/constants";
import { columnMutation, projectMutation, taskMutation } from "./lib/customs";
import { ProjectDoneColumnNotSetError } from "./lib/errors";
import {
  remapRanksDueToTaskAddition,
  remapRanksDueToTaskRankChange,
  remapRanksDueToTaskRemoval,
} from "./lib/utils";

export const createProject = authenticatedMutation({
  args: {
    name: v.string(),
    description: v.string(),
    tags: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const slug = slugify(args.name, { lower: true });

    const projectId = await ctx.db.insert("projects", {
      ...args,
      userId: ctx.userId,
      slug,
    });

    // create default columns
    const [todoColumnId, inProgressColumnId, doneColumnId] = await Promise.all(
      DEFAULT_COLUMNS.map((column) =>
        ctx.db.insert("columns", {
          ...column,
          projectId: projectId,
        }),
      ),
    );

    await ctx.db.insert("projectTaskTagsRef", {
      name: "fix",
      color: "#F06292",
      projectId,
    });

    Promise.all([
      ctx.db.insert("tasks", {
        name: "Task 1",
        projectId,
        columnId: todoColumnId,
        completed: false,
        tags: ["fix"],
        userId: ctx.userId,
        rank: 0,
        updatedAt: Date.now(),
      }),

      ctx.db.insert("tasks", {
        name: "Task 2",
        projectId,
        columnId: inProgressColumnId,
        completed: false,
        tags: [],
        userId: ctx.userId,
        rank: 0,
        updatedAt: Date.now(),
      }),
      ctx.db.insert("tasks", {
        name: "Task 3",
        projectId,
        columnId: doneColumnId,
        completed: true,
        tags: [],
        userId: ctx.userId,
        rank: 0,
        updatedAt: Date.now(),
      }),
    ]);

    // set what column for that project is the done column
    await ctx.db.patch(projectId, {
      doneColumnId,
    });
  },
});

export const updateProject = projectMutation({
  args: {
    projectId: v.id("projects"),
    patch: v.object({
      name: v.optional(v.string()),
      description: v.optional(v.string()),
      tags: v.optional(v.array(v.string())),
    }),
  },
  handler: async (ctx, args) => {
    console.log("args", args);
    return await ctx.db.patch(args.projectId, {
      ...args.patch,
      ...(args.patch.name && {
        slug: slugify(args.patch.name, { lower: true }),
      }),
    });
  },
});

export const deleteProject = projectMutation({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, args) => {
    const [columns, tasks, projectTaskTagsRef] = await Promise.all([
      ctx.db
        .query("columns")
        .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
        .collect(),
      ctx.db
        .query("tasks")
        .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
        .collect(),
      ctx.db
        .query("projectTaskTagsRef")
        .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
        .collect(),
    ]);

    await Promise.all([
      Promise.all(columns.map((column) => ctx.db.delete(column._id))),
      Promise.all(tasks.map((task) => ctx.db.delete(task._id))),
      Promise.all(projectTaskTagsRef.map((tag) => ctx.db.delete(tag._id))),
    ]);

    await ctx.db.delete(args.projectId);
  },
});

export const addProjectTagRef = authenticatedMutation({
  args: {
    name: v.string(),
    color: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("projectTagsRef", {
      ...args,
      userId: ctx.userId,
    });
  },
});

export const addProjectTaskTagRef = projectMutation({
  args: {
    name: v.string(),
    color: v.string(),
    projectId: v.id("projects"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("projectTaskTagsRef", args);
  },
});

export const createColumn = projectMutation({
  args: {
    name: v.string(),
    rank: v.number(),
    projectId: v.id("projects"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("columns", {
      ...args,
    });
  },
});

export const updateColumn = columnMutation({
  args: {
    columnId: v.id("columns"),
    patch: v.object({
      name: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.columnId, {
      ...args.patch,
    });
  },
});

export const deleteColumn = columnMutation({
  args: {
    columnId: v.id("columns"),
  },
  handler: async (ctx, args) => {
    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_column", (q) => q.eq("columnId", args.columnId))
      .collect();

    await Promise.all(tasks.map((task) => ctx.db.delete(task._id)));

    await ctx.db.delete(args.columnId);
  },
});

export const moveColumn = columnMutation({
  args: {
    columnId: v.id("columns"),
    newRank: v.number(),
  },
  handler: async (ctx, args) => {
    const projectColumns = await ctx.db
      .query("columns")
      .withIndex("by_project", (q) => q.eq("projectId", ctx.column.projectId))
      .collect();

    const columnsToUpgradeRanks = projectColumns.filter(
      (column) => column.rank >= args.newRank,
    );

    await Promise.all(
      columnsToUpgradeRanks.map((column) => {
        return ctx.db.patch(column._id, {
          rank: column.rank + 1,
        });
      }),
    );

    await ctx.db.patch(args.columnId, {
      rank: args.newRank,
    });
  },
});

export const createTask = columnMutation({
  args: {
    name: v.string(),
    columnId: v.id("columns"),
    rank: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
    completed: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let rank = args.rank;

    // if no rank is provided, set it to the number of tasks in the column (corresponds to the next available rank)
    if (!rank) {
      const tasks = await ctx.db
        .query("tasks")
        .withIndex("by_project_column", (q) =>
          q.eq("projectId", ctx.column.projectId).eq("columnId", args.columnId),
        )
        .collect();
      rank = tasks.length;
    }

    return await ctx.db.insert("tasks", {
      ...args,
      tags: args.tags || [],
      rank,
      userId: ctx.project.userId,
      projectId: ctx.project._id,
      updatedAt: Date.now(),
      completed: args.completed || false,
    });
  },
});

export const updateTask = taskMutation({
  args: {
    taskId: v.id("tasks"),
    projectId: v.id("projects"),
    patch: v.object({
      name: v.optional(v.string()),
      tags: v.optional(v.array(v.string())),
      completed: v.optional(v.boolean()),
      description: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.taskId, {
      ...args.patch,
      updatedAt: Date.now(),
    });
  },
});

export const markTaskAsCompleted = taskMutation({
  args: {
    taskId: v.id("tasks"),
  },
  handler: async (ctx, args) => {
    if (!ctx.project.doneColumnId) throw new ProjectDoneColumnNotSetError();

    const tasksInDoneColumn = await ctx.db
      .query("tasks")
      .withIndex("by_project_column", (q) =>
        q
          .eq("projectId", ctx.task.projectId)
          // biome-ignore lint/style/noNonNullAssertion: validated by the above if statement (dont know why typescript still considers it nullable)
          .eq("columnId", ctx.project.doneColumnId!),
      )
      .collect();

    await ctx.runMutation(api.projects.mutations.moveTask, {
      taskId: args.taskId,
      newColumnId: ctx.project.doneColumnId,
      newRank: tasksInDoneColumn.length,
    });

    return await ctx.db.patch(args.taskId, {
      completed: true,
    });
  },
});

export const moveTask = taskMutation({
  args: {
    taskId: v.id("tasks"),
    newColumnId: v.optional(v.id("columns")),
    newRank: v.number(),
  },
  handler: async (ctx, args) => {
    if (!args.newColumnId) {
      return Promise.all([
        remapRanksDueToTaskRankChange({
          ctx,
          projectId: ctx.task.projectId,
          columnId: ctx.task.columnId,
          taskId: args.taskId,
          newRank: args.newRank,
        }),
        ctx.db.patch(args.taskId, {
          rank: args.newRank,
        }),
      ]);
    }

    await Promise.all([
      remapRanksDueToTaskRemoval({
        ctx,
        projectId: ctx.task.projectId,
        columnId: ctx.task.columnId,
        taskId: args.taskId,
      }),

      remapRanksDueToTaskAddition({
        ctx,
        projectId: ctx.task.projectId,
        columnId: args.newColumnId,
        newRank: args.newRank,
      }),
    ]);

    return await ctx.db.patch(args.taskId, {
      columnId: args.newColumnId,
      rank: args.newRank,
    });
  },
});

export const deleteTask = taskMutation({
  args: {
    taskId: v.id("tasks"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.taskId);
  },
});

export const updateColumnsRanks = authenticatedMutation({
  args: {
    columnsPatchs: v.array(
      v.object({
        id: v.id("columns"),
        rank: v.number(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    await Promise.all(
      args.columnsPatchs.map((columnRankPatch) => {
        return ctx.db.patch(columnRankPatch.id, {
          rank: columnRankPatch.rank,
        });
      }),
    );
  },
});

export const bulkUpdateTasks = authenticatedMutation({
  args: {
    tasksPatchs: v.array(
      v.object({
        id: v.id("tasks"),
        patch: v.object({
          rank: v.number(),
          columnId: v.optional(v.id("columns")),
        }),
      }),
    ),
  },
  handler: async (ctx, args) => {
    await Promise.all(
      args.tasksPatchs.map((taskPatch) => {
        return ctx.db.patch(taskPatch.id, {
          ...taskPatch.patch,
        });
      }),
    );
  },
});
