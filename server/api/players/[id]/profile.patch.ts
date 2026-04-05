import { api } from "~~/convex/_generated/api";
import type { Id } from "~~/convex/_generated/dataModel";
import { isAdminId } from "~~/server/utils/requireAdmin";
import { getUser } from "~~/server/utils/getUser";

export default defineEventHandler(async (event) => {
  const user = await getUser(event);

  if (!user) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  const id = getRouterParam(event, "id") as Id<"players">;
  const body = await readBody(event);
  const authUser = await convex.query(api.auth.getAuthUser, { osu_id: user.osu_id });
  const requesterOwnsProfile = authUser?.player_id === id;
  const requesterIsAdmin = isAdminId(user.osu_id);

  if (!requesterOwnsProfile && !requesterIsAdmin) {
    throw createError({ statusCode: 403, message: "Forbidden" });
  }

  return await convex.mutation(api.players.updatePlayerProfile, {
    id,
    requester_osu_id: user.osu_id,
    description: body.description,
    links: body.links,
  });
});
