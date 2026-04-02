import { api } from "~~/convex/_generated/api";
import type { Id } from "~~/convex/_generated/dataModel";

export default defineEventHandler(async (event) => {
  const user = await getUser(event);
  if (!user) throw createError({ statusCode: 401, message: "Unauthorized" });

  const id = getRouterParam(event, "id") as Id<"skins">;

  return await convex.mutation(api.skins.deleteSkin, { _id: id });
});
