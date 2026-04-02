import { api } from "~~/convex/_generated/api";
import type { Id } from "~~/convex/_generated/dataModel";

export default defineEventHandler(async (event) => {
  const user = await getUser(event);
  if (!user) throw createError({ statusCode: 401, message: "Unauthorized" });

  const id = getRouterParam(event, "id") as Id<"players">;
  const body = await readBody(event);

  return await convex.mutation(api.players.updatePlayer, {
    id,
    name: body.name,
    cover_url: body.cover_url,
    previous_usernames: body.previous_usernames,
  });
});
