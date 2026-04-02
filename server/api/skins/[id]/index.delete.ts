import { api } from "~~/convex/_generated/api";
import type { Id } from "~~/convex/_generated/dataModel";

export default defineEventHandler(async (event) => {
  await requireAdmin(event);

  const id = getRouterParam(event, "id") as Id<"skins">;

  return await convex.mutation(api.skins.deleteSkin, { _id: id });
});
