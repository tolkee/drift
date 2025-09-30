import { ConvexError, type Value } from "convex/values";
import type { ErrorData } from "../../types";

export class NotFoundError extends ConvexError<ErrorData> {
  constructor(metadata?: Record<string, Value>) {
    super({
      message: "Not found",
      code: "NOT_FOUND",
      metadata,
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

export class ProjectDoneColumnNotSetError extends ConvexError<ErrorData> {
  constructor() {
    super({
      message: "Project done column not set",
      code: "PROJECT_DONE_COLUMN_NOT_SET",
    });
  }
}
