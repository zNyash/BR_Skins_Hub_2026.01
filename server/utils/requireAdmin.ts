import type { H3Event } from "h3";

function getAdminIds(): Set<number> {
  const raw = process.env.ADMIN_OSU_IDS ?? "";
  return new Set(
    raw
      .split(",")
      .map((id) => Number(id.trim()))
      .filter((id) => !isNaN(id) && id > 0),
  );
}

export function isAdminId(osuId: number): boolean {
  return getAdminIds().has(osuId);
}

export async function requireAdmin(event: H3Event) {
  const user = await getUser(event);

  if (!user) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  if (!isAdminId(user.osu_id)) {
    throw createError({ statusCode: 403, message: "Forbidden" });
  }

  return user;
}
