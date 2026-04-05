import { api } from "~~/convex/_generated/api";
import type { Id } from "~~/convex/_generated/dataModel";

export default defineEventHandler(async (event) => {
  await requireAdmin(event);

  const idParam = getRouterParam(event, "id");
  if (!idParam) {
    throw createError({ statusCode: 400, message: "Missing skin id." });
  }

  const body = (await readBody(event)) as Record<string, unknown>;

  if (body.name !== undefined && typeof body.name !== "string") {
    throw createError({ statusCode: 400, message: "Invalid name." });
  }

  if (body.author !== undefined && typeof body.author !== "string") {
    throw createError({ statusCode: 400, message: "Invalid author." });
  }

  if (body.download_url !== undefined && typeof body.download_url !== "string") {
    throw createError({ statusCode: 400, message: "Invalid download_url." });
  }

  if (
    body.preview_images !== undefined &&
    (!Array.isArray(body.preview_images) ||
      body.preview_images.some((url) => typeof url !== "string" || url.length === 0))
  ) {
    throw createError({ statusCode: 400, message: "Invalid preview_images." });
  }

  if (
    body.download_count !== undefined &&
    (typeof body.download_count !== "number" ||
      !Number.isFinite(body.download_count) ||
      body.download_count < 0)
  ) {
    throw createError({ statusCode: 400, message: "Invalid download_count." });
  }

  const id = idParam as Id<"skins">;

  return await convex.mutation(api.skins.updateSkin, {
    _id: id,
    name: body.name,
    author: body.author,
    download_url: body.download_url,
    preview_images: body.preview_images,
    download_count: body.download_count,
  });
});
