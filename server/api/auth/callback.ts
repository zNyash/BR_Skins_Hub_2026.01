import { ConvexHttpClient } from "convex/browser";
import { api } from "~~/convex/_generated/api";
import type { OsuTokenResponse } from "~~/server/types/osu-token";
import type { OsuUser } from "~~/server/types/me";

const convex = new ConvexHttpClient(process.env.CONVEX_URL!);

export default defineEventHandler(async (event) => {
  const { code } = getQuery(event);

  if (typeof code !== "string") {
    throw createError({ statusCode: 400, message: "Authorization code is missing" });
  }

  const {
    public: { osuClientId, currentDomain },
    osuClientSecret,
  } = useRuntimeConfig();

  // Exchange the authorization code for an access token
  const { access_token } = await $fetch<OsuTokenResponse>("https://osu.ppy.sh/oauth/token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: {
      client_id: osuClientId,
      client_secret: osuClientSecret,
      code,
      grant_type: "authorization_code",
      redirect_uri: `${currentDomain}/api/auth/callback`,
    },
  });

  // Use the access token to fetch the user's osu! profile
  const me = await $fetch<OsuUser>("https://osu.ppy.sh/api/v2/me", {
    headers: { Authorization: `Bearer ${access_token}` },
  });

  // Upsert the user in the database and create a session token
  await convex.mutation(api.auth.upsertUser, { osu_id: me.id, username: me.username });

  const token = await createToken(me.id);
  setCookie(event, "session", token, { httpOnly: true, secure: true, sameSite: "lax", path: "/" });

  return sendRedirect(event, "/");
});
