import { api } from "~~/convex/_generated/api";
import type { Id } from "~~/convex/_generated/dataModel";

export default defineEventHandler(async (event) => {
  await requireAdmin(event);

  const playerIdParam = getRouterParam(event, "playerId");
  if (!playerIdParam) {
    throw createError({ statusCode: 400, message: "Missing player id." });
  }

  const body = (await readBody(event)) as Record<string, unknown>;
  const skinIds = body.skin_ids;

  if (!Array.isArray(skinIds) || skinIds.some((id) => typeof id !== "string" || id.length === 0)) {
    throw createError({ statusCode: 400, message: "Invalid skin_ids." });
  }

  const playerId = playerIdParam as Id<"players">;

  return await convex.mutation(api.playerSkins.updatePlayerSkins, {
    player_id: playerId,
    skin_ids: skinIds as Id<"skins">[],
  });
});
