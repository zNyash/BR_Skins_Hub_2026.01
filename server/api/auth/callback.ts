import { OsuUser } from "~~/server/types/me";

interface OsuTokenResponse {
  token_type: "Bearer"; // always Bearer
  expires_in: number; // seconds until expiration
  access_token: string;
  refresh_token: string;
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const code = query.code as string;

  if (!code) {
    throw createError({
      statusCode: 400,
      message: "Authorization code is missing",
    });
  }

  const runtimeConfig = useRuntimeConfig();
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

  const me = await $fetch<OsuUser>("https://osu.ppy.sh/api/v2/me", {
    headers: {
      Authorization: `Bearer ${tokenResponse.access_token}`,
    },
  });

  return {
    osu_id: me.id,
    username: me.username,
  };
});
