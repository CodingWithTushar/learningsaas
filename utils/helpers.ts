import { UploadApiOptions } from "cloudinary";
import { auth } from "@clerk/nextjs/server";

import { CloudinaryUploadResult } from "@/types/cloudinary";
import cloudinary from "@/lib/cloudinary";

export const requireUser = async () => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  return userId;
};

export const uploadToCloudinary = async (
  file: File,
  options: UploadApiOptions,
): Promise<CloudinaryUploadResult> => {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  return new Promise<CloudinaryUploadResult>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result as CloudinaryUploadResult);
      },
    );

    stream.end(buffer);
  });
};
