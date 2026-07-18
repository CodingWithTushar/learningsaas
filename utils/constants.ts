import { UploadApiOptions } from "cloudinary";

export const imageOptions: UploadApiOptions = { folder: "learningSaas/images" };

export const videoOptions: UploadApiOptions = {
  folder: "learningSaas/videos",
  resource_type: "video",
  transformation: [
    {
      quality: "auto",
      fetch_format: "mp4",
    },
  ],
};
