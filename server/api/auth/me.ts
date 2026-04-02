import { api } from "~~/convex/_generated/api";

export default defineEventHandler(async (event) => {
  const user = await getUser(event);

  if (!user) {
    return { osu_id: -1, isAdmin: false, username: null, avatar_url: null };
  }

  const authUser = await convex.query(api.auth.getAuthUser, { osu_id: user.osu_id });

  return {
    osu_id: user.osu_id,
    isAdmin: isAdminId(user.osu_id),
    username: authUser?.username ?? null,
    avatar_url: `https://a.ppy.sh/${user.osu_id}`,
  };
});
