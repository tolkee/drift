import { defineTable } from "convex/server";
import { v } from "convex/values";

export default {
  projects: defineTable({
    name: v.string(),
    description: v.string(),
    tags: v.array(v.string()),
  }),
};
