import { api } from "~~/convex/_generated/api";

export default defineEventHandler(async (event) => {
  await requireAdmin(event);

  const body = (await readBody(event)) as Record<string, unknown>;

  if (typeof body.name !== "string" || body.name.trim().length === 0) {
    throw createError({ statusCode: 400, message: "Invalid skin name." });
  }

  if (body.author !== undefined && typeof body.author !== "string") {
    throw createError({ statusCode: 400, message: "Invalid author." });
  }

  if (typeof body.download_url !== "string" || body.download_url.trim().length === 0) {
    throw createError({ statusCode: 400, message: "Invalid download_url." });
  }

  if (
    !Array.isArray(body.preview_images) ||
    body.preview_images.length === 0 ||
    body.preview_images.some((url) => typeof url !== "string" || url.length === 0)
  ) {
    throw createError({ statusCode: 400, message: "Invalid preview_images." });
  }

  return await convex.mutation(api.skins.createSkin, {
    name: body.name,
    author: body.author,
    download_url: body.download_url,
    preview_images: body.preview_images,
  });
});
