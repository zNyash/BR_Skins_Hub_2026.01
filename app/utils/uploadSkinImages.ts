import { genUploader } from "uploadthing/client";
import type { UploadRouter } from "~~/server/uploadthing";

const { uploadFiles } = genUploader<UploadRouter>();

/**
 * Uploads skin images to UploadThing and returns their URLs.
 */
export default async function uploadSkinImages(files: File[]) {
  if (!files || files.length === 0) return [];

  const response = await uploadFiles("skinImages", {
    files: files,
  });

  if (!response) return [];

  const URLs = response.map((item) => item.ufsUrl);

  return URLs;
}
