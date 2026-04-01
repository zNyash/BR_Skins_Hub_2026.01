import { getUser } from "~~/server/utils/getUser";

export default defineEventHandler(async (event) => {
  const user = await getUser(event);

  if (!user) {
    return {
      osu_id: -1,
    };
  }

  return user;
});
