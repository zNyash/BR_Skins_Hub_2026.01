import { api } from "~~/convex/_generated/api";
import type { Id } from "~~/convex/_generated/dataModel";

// Public endpoint — no auth required. Only increments download count.
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id") as Id<"skins">;

  const skin = await convex.query(api.skins.getSkin, { id });

  if (!skin) {
    throw createError({ statusCode: 404, message: "Skin not found" });
  }

  await convex.mutation(api.skins.updateSkin, {
    _id: id,
    download_count: skin.download_count + 1,
  });
});
