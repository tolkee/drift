import { defineSchema } from "convex/server";
import projectsTables from "./projects/tables";

export default defineSchema({
  ...projectsTables,
});
