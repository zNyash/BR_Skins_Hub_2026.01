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
  const user = await v2.users.details({ user: Number(osu_id), key: "id" });

  if (!user) {
    throw new Error("User not found");
  }
  return user;
});
