import { JwtSessionPayload } from "~~/server/types/jwt";

export default defineEventHandler(async (event) => {
  const user = await getUser(event);

  if (!user) {
    return {
      osu_id: -1,
    } satisfies JwtSessionPayload;
  }

  return user;
});
