import { createUploadthing, FileRouter } from "uploadthing/h3";

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

export type UploadRouter = typeof uploadRouter;
