import { NextRequest, NextResponse } from "next/server";

import { requireUser, uploadToCloudinary } from "@/utils/helpers";
import { imageOptions } from "@/utils/constants";

export async function POST(request: NextRequest) {
  try {
    const userId = requireUser();

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 400 });
    }

    const result = await uploadToCloudinary(file, imageOptions);

    return NextResponse.json({ publicId: result.public_id }, { status: 200 });
  } catch (error) {
    console.log("Upload image failed", error);
    return NextResponse.json({ error: "Upload image failed" }, { status: 500 });
  }
}
