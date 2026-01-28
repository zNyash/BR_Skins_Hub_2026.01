import { utapi } from "~~/server/uploadthing";

export default defineEventHandler<{ body: string[] }>(async (event) => {
  const imageUrls = await readBody(event);

  const fileKeys = imageUrls
    .map((url) => {
      const urlParts = url.split("/");
      return urlParts[urlParts.length - 1];
    })
    .filter((key): key is string => !!key);

  utapi.deleteFiles(fileKeys);

  return { success: true };
});
