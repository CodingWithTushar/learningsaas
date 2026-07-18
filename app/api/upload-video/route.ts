import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { videoOptions } from "@/utils/constants";
import { requireUser, uploadToCloudinary } from "@/utils/helpers";

export async function POST(request: NextRequest) {
  try {
    const userId = await requireUser();

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const originalSize = formData.get("originalSize") as string;

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 400 });
    }
    const result = await uploadToCloudinary(file, videoOptions);

    const video = await prisma.video.create({
      data: {
        Title: title,
        description: description,
        publicId: result.public_id,
        originalSize: originalSize,
        compressedSize: String(result.bytes),
        duration: result.duration || 0,
      },
    });

    return NextResponse.json(video);
  } catch (error) {
    console.log("Upload Video failed", error);
    return NextResponse.json({ error: "Upload Video failed" }, { status: 500 });
  }
}
