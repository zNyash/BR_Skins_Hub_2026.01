import { ConvexHttpClient } from "convex/browser";
import { api } from "~~/convex/_generated/api";
import type { OsuTokenResponse } from "~~/server/types/osu-token";
import type { OsuUser } from "~~/server/types/me";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const code = query.code;

  if (typeof code !== "string") {
    throw createError({ statusCode: 400, message: "Authorization code is missing" });
  }

  const runtimeConfig = useRuntimeConfig();
  const convex = new ConvexHttpClient(process.env.CONVEX_URL!);

  // Exchange the authorization code for an access token
  const tokenResponse = await $fetch<OsuTokenResponse>("https://osu.ppy.sh/oauth/token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: {
      client_id: runtimeConfig.public.osuClientId,
      client_secret: runtimeConfig.osuClientSecret,
      code,
      grant_type: "authorization_code",
      redirect_uri: `${runtimeConfig.public.currentDomain}/api/auth/callback`,
    },
  });

  // Use the access token to fetch the user's profile information
  const me = await $fetch<OsuUser>("https://osu.ppy.sh/api/v2/me", {
    headers: {
      Authorization: `Bearer ${tokenResponse.access_token}`,
    },
  });

  // Upsert the user in the database
  await convex.mutation(api.auth.upsertUser, {
    osu_id: me.id,
    username: me.username,
  });

  // Create a session token for the user and set it as a cookie
  const token = await createToken(me.id);

  setCookie(event, "session", token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
  });

  return sendRedirect(event, "/");
});
