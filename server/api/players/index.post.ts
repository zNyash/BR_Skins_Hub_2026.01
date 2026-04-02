import { api } from "~~/convex/_generated/api";

export default defineEventHandler(async (event) => {
  await requireAdmin(event);

  const body = await readBody(event);

  return await convex.mutation(api.players.createPlayer, {
    name: body.name,
    osu_id: body.osu_id,
    cover_url: body.cover_url,
    previous_usernames: body.previous_usernames,
  });
});
