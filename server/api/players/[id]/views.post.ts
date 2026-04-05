import { api } from "~~/convex/_generated/api";
import type { Id } from "~~/convex/_generated/dataModel";
import { createRateLimiter } from "~~/server/utils/rateLimit";

const viewsRateLimiter = createRateLimiter({
  key: "players-views",
  maxRequests: 20,
  windowMs: 60_000,
});

export default defineEventHandler(async (event) => {
  viewsRateLimiter.check(event);

  const id = getRouterParam(event, "id") as Id<"players">;

  return await convex.mutation(api.players.incrementPlayerViews, {
    id,
  });
});
