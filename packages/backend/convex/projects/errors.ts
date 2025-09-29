import { ConvexError } from "convex/values";
import type { ErrorData } from "../types";

export class ProjectNotFoundError extends ConvexError<ErrorData> {
  constructor() {
    super({
      message: "Project not found",
      code: "PROJECT_NOT_FOUND",
    });
  }
}

export class NotAllowedToAccessProjectError extends ConvexError<ErrorData> {
  constructor() {
    super({
      message: "Not allowed to access project",
      code: "NOT_ALLOWED_TO_ACCESS_PROJECT",
    });
  }
}
