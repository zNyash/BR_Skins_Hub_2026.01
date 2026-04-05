import { api } from "~~/convex/_generated/api";

export default defineEventHandler(async (event) => {
  await requireAdmin(event);

  const body = (await readBody(event)) as Record<string, unknown>;

  if (typeof body.name !== "string" || body.name.trim().length === 0) {
    throw createError({ statusCode: 400, message: "Invalid player name." });
  }

  if (typeof body.osu_id !== "number" || !Number.isFinite(body.osu_id) || body.osu_id <= 0) {
    throw createError({ statusCode: 400, message: "Invalid osu_id." });
  }

  if (body.cover_url !== undefined && typeof body.cover_url !== "string") {
    throw createError({ statusCode: 400, message: "Invalid cover_url." });
  }

  if (
    body.previous_usernames !== undefined &&
    (!Array.isArray(body.previous_usernames) ||
      body.previous_usernames.some((item) => typeof item !== "string"))
  ) {
    throw createError({ statusCode: 400, message: "Invalid previous_usernames." });
  }

  return await convex.mutation(api.players.createPlayer, {
    name: body.name,
    osu_id: body.osu_id,
    cover_url: body.cover_url,
    previous_usernames: body.previous_usernames,
  });
});
