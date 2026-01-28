import { createUploadthing, FileRouter } from "uploadthing/h3";
import { UTApi } from "uploadthing/server";

const f = createUploadthing();

export const uploadRouter = {
  skinImages: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 6,
    },
  }).onUploadComplete(async ({ file }) => {
    return { imageUrl: file.ufsUrl };
  }),
} satisfies FileRouter;

export const utapi = new UTApi({ token: process.env.NUXT_UPLOADTHING_TOKEN });
export type UploadRouter = typeof uploadRouter;
