import { defineTable } from "convex/server";
import { v } from "convex/values";

export default {
  projects: defineTable({
    name: v.string(),
    description: v.string(),
    tags: v.array(v.string()),
    slug: v.string(),
    userId: v.string(),
  })
    .index("by_user", ["userId"])
    .index("by_slug_user", ["slug", "userId"]),
  columns: defineTable({
    name: v.string(),
    rank: v.number(),
    projectId: v.id("projects"),
  }).index("by_project", ["projectId"]),
  tasks: defineTable({
    name: v.string(),
    rank: v.number(),
    description: v.optional(v.string()),
    tags: v.array(v.string()),
    userId: v.string(),
    projectId: v.id("projects"),
    completed: v.boolean(),
    columnId: v.id("columns"),
  })
    .index("by_user", ["userId"])
    .index("by_project", ["projectId"])
    .index("by_column", ["columnId"]),
  projectTagsRef: defineTable({
    name: v.string(),
    color: v.string(),
    userId: v.string(),
  }).index("by_user", ["userId"]),
};
