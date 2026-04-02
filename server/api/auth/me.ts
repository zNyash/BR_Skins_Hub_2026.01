export default defineEventHandler(async (event) => {
  const user = await getUser(event);

  if (!user) {
    return { osu_id: -1, isAdmin: false };
  }

  return { ...user, isAdmin: isAdminId(user.osu_id) };
});
