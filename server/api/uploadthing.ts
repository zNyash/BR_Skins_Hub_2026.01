import { createRouteHandler } from "uploadthing/h3";
import { uploadRouter } from "../uploadthing";

export default createRouteHandler({
  router: uploadRouter,
  config: {
    token: process.env.NUXT_UPLOADTHING_TOKEN,
  },
});
