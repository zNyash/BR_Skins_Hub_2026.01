import { api } from "~~/convex/_generated/api";
import type { Id } from "~~/convex/_generated/dataModel";

export default defineEventHandler(async (event) => {
  await requireAdmin(event);

  const idParam = getRouterParam(event, "id");
  if (!idParam) {
    throw createError({ statusCode: 400, message: "Missing player id." });
  }

  const body = (await readBody(event)) as Record<string, unknown>;

  if (body.name !== undefined && typeof body.name !== "string") {
    throw createError({ statusCode: 400, message: "Invalid player name." });
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

  const id = idParam as Id<"players">;

  return await convex.mutation(api.players.updatePlayer, {
    id,
    name: body.name,
    cover_url: body.cover_url,
    previous_usernames: body.previous_usernames,
  });
});
