import { NextResponse } from "next/server";
import { list, put } from "@vercel/blob";
import crypto from "crypto";

import { redis } from "@/utils/redisClient";
import { getBlobFileData } from "@/utils/blobRequests";

export async function GET(): Promise<NextResponse> {
  try {
    const cvs = await redis.lrange("cvs", 0, -1);
    return NextResponse.json({ cvs });
  } catch (error) {
    return NextResponse.json(
      { message: `Error occurred while fetching: ${error}` },
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

    const fileExists = blobs.some((blob) => {
      const { savedHash, fileName } = getBlobFileData(blob);
      return savedHash === hash && fileName === file.name;
    });

    if (fileExists) {
      const cvs = await redis.lrange("cvs", 0, -1);
      return NextResponse.json({ cvs });
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

    await redis.lpush(
      "cvs",
      JSON.stringify({
        downloadUrl: blob.downloadUrl,
        fileName: file.name,
        url: blob.url,
        createdAt: new Date().toISOString(),
      })
    );

    const cvs = await redis.lrange("cvs", 0, -1);

    return NextResponse.json({ cvs });
  } catch (error) {
    return NextResponse.json(
      { message: `Error uploading file: ${error}` },
      { status: 500 }
    );
  }
}
