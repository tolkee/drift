import { ConvexError } from "convex/values";
import type { ErrorData } from "../types";

export class NotAuthenticatedError extends ConvexError<ErrorData> {
  constructor() {
    super({
      message: "Not authenticated",
      code: "NOT_AUTHENTICATED",
    });
  }
}
