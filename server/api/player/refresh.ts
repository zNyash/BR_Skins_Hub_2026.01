import { auth, v2 } from "osu-api-extended";

export default defineEventHandler(async (event) => {
  const { osu_id } = getQuery(event);
  if (!osu_id) {
    throw new Error("No osu_id provided");
  }

  await auth.login({
    type: "v2",
    client_id: useRuntimeConfig().public.osuClientId,
    client_secret: useRuntimeConfig().osuClientSecret,
    scopes: ["public"],
  });

  const users = await v2.users.lookup({ ids: [Number(osu_id)] });
  const user = users[0];

  if (!user) {
    throw new Error("User not found");
  }
  return user;
});
