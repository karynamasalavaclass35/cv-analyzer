import { NextResponse } from "next/server";
import { redis } from "@/utils/redisClient";
import { PutBlobResult } from "@vercel/blob";

export async function GET(): Promise<NextResponse> {
  try {
    const cvs = await redis.lrange("cvs", 0, -1);

    if (!cvs) {
      return NextResponse.json(
        { message: "Failed to fetch CVs" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: cvs });
  } catch (error) {
    return NextResponse.json(
      { message: `Error occurred while fetching: ${error}` },
      { status: 500 }
    );
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  const {
    blob,
    id,
    fileName,
  }: { blob: PutBlobResult; id: string; fileName: string } =
    await request.json();

  if (!blob || !id) {
    return NextResponse.json({ message: "No body provided" }, { status: 400 });
  }

  try {
    const { downloadUrl, url } = blob;

    const cv = await redis.lpush(
      "cvs",
      JSON.stringify({
        id,
        downloadUrl,
        fileName,
        url,
        createdAt: new Date().toISOString(),
        roles: [],
      })
    );

    return NextResponse.json({ data: cv });
  } catch (error) {
    return NextResponse.json(
      { message: `Error uploading cv to database: ${error}` },
      { status: 500 }
    );
  }
}
