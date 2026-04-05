import { api } from "~~/convex/_generated/api";
import type { Id } from "~~/convex/_generated/dataModel";

export default defineEventHandler(async (event) => {
  await requireAdmin(event);

  const id = getRouterParam(event, "id") as Id<"players">;

  return await convex.mutation(api.players.deletePlayer, { player_id: id });
});
