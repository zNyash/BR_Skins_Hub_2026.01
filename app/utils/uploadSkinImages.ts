import { genUploader } from "uploadthing/client";
import type { UploadRouter } from "~~/server/uploadthing";
import { convertToWebp } from "./convertToWebp";

const { uploadFiles } = genUploader<UploadRouter>();

/**
 * Uploads skin images to UploadThing and returns their URLs.
 * Images are automatically converted to WebP format and compressed to under 800KB.
 */
export default async function uploadSkinImages(files: File[]) {
  try {
    if (!files || files.length === 0) return [];

    const convertedFiles = await convertToWebp(files);

    const response = await uploadFiles("skinImages", {
      files: convertedFiles,
    });

    if (!response) return [];

    const URLs = response.map((item) => item.ufsUrl);

    return URLs;
  } catch (error) {
    console.error("Error uploading skin images:", error);
    return [];
  }
}
