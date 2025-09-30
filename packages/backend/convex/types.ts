import type { Value } from "convex/values";

export type ErrorData = {
  message: string;
  code: string;
  metadata?: Record<string, Value>;
};
