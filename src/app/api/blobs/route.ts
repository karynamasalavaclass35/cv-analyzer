import { put, list } from "@vercel/blob";
import { NextResponse } from "next/server";
import crypto from "crypto";

import { getBlobFileData } from "@/utils/blobRequests";

export async function GET(): Promise<NextResponse> {
  try {
    const { blobs } = await list();

    if (!blobs.length) {
      return NextResponse.json({ data: [] });
    }

    return NextResponse.json({ data: blobs });
  } catch (error) {
    return NextResponse.json(
      { message: `Error occurred while fetching blobs: ${error}` },
      { status: 500 }
    );
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  const formData = await request.formData();
  const file = formData.get("file") as File;

  if (!file.name) {
    return NextResponse.json({ message: "No file provided" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const hash = crypto
    .createHash("sha256")
    .update(Buffer.from(arrayBuffer))
    .digest("hex");

  try {
    const { blobs } = await list();

    const blobFound = blobs.find((blob) => {
      const { savedHash, fileName } = getBlobFileData(blob);
      return savedHash === hash && fileName === file.name;
    });

    if (!!blobFound) {
      return NextResponse.json({ data: blobFound });
    }

    const blob = await put(`${hash}-${file.name}`, file, {
      access: "public",
    });

    if (!blob) {
      return NextResponse.json(
        { message: "Error uploading file to blob storage" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: blob });
  } catch (error) {
    return NextResponse.json(
      { message: `Error uploading file: ${error}` },
      { status: 500 }
    );
  }
}
