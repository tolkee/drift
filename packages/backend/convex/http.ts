import { httpRouter } from "convex/server";
import { authComponent, createAuth } from "./auth/auth";

const http = httpRouter();

// CORS handling is required for client side frameworks
authComponent.registerRoutes(http, createAuth, {
  cors: {
    // allow authorization headers (better-auth uses this in pre-flight requests)
    allowedHeaders: ["Authorization"],
  },
});

export default http;
