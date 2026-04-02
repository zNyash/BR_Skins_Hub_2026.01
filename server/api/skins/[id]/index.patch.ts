import { api } from "~~/convex/_generated/api";
import type { Id } from "~~/convex/_generated/dataModel";

export default defineEventHandler(async (event) => {
  await requireAdmin(event);

  const id = getRouterParam(event, "id") as Id<"skins">;
  const body = await readBody(event);

  return await convex.mutation(api.skins.updateSkin, {
    _id: id,
    name: body.name,
    author: body.author,
    download_url: body.download_url,
    preview_images: body.preview_images,
    download_count: body.download_count,
  });
});
