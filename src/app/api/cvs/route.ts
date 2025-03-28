import { NextResponse } from "next/server";
import { redis } from "@/utils/redisClient";
import { PutBlobResult } from "@vercel/blob";

import { Prompt } from "@/app/components/prompt/types";

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
    prompt,
  }: { blob: PutBlobResult; id: string; fileName: string; prompt: Prompt } =
    await request.json();

  if (!blob) {
    return NextResponse.json({ message: "No blob provided" }, { status: 400 });
  }

  if (!id) {
    return NextResponse.json({ message: "No id provided" }, { status: 400 });
  }

  if (!fileName) {
    return NextResponse.json(
      { message: "No file name provided" },
      { status: 400 }
    );
  }

  if (!prompt) {
    return NextResponse.json(
      { message: "No prompt provided" },
      { status: 400 }
    );
  }

  if (!blob && !id && !prompt && !fileName) {
    return NextResponse.json({ message: "No body provided" }, { status: 400 });
  }

  try {
    const { downloadUrl, url } = blob;

    await redis.lpush(
      "cvs",
      JSON.stringify({
        id,
        downloadUrl,
        fileName,
        url,
        createdAt: new Date().toISOString(),
        roles: [
          {
            id: "1", // fixme:
            name: prompt.name,
            description: prompt.description,
          },
        ],
      })
    );

    const cvs = await redis.lrange("cvs", 0, -1);

    return NextResponse.json({ data: cvs });
  } catch (error) {
    return NextResponse.json(
      { message: `Error uploading cv to database: ${error}` },
      { status: 500 }
    );
  }
}
