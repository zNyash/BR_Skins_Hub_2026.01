import { api } from "~~/convex/_generated/api";

export default defineEventHandler(async (event) => {
  const user = await getUser(event);
  if (!user) throw createError({ statusCode: 401, message: "Unauthorized" });

  const body = await readBody(event);

  return await convex.mutation(api.skins.createSkin, {
    name: body.name,
    author: body.author,
    download_url: body.download_url,
    preview_images: body.preview_images,
  });
});
