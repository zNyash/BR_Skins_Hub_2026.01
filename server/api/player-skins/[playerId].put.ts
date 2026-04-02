import { api } from "~~/convex/_generated/api";
import type { Id } from "~~/convex/_generated/dataModel";

export default defineEventHandler(async (event) => {
  await requireAdmin(event);

  const playerId = getRouterParam(event, "playerId") as Id<"players">;
  const body = await readBody(event);

  return await convex.mutation(api.playerSkins.updatePlayerSkins, {
    player_id: playerId,
    skin_ids: body.skin_ids as Id<"skins">[],
  });
});
