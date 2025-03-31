import { NextResponse } from "next/server";
import { redis } from "@/utils/redisClient";
import { PutBlobResult } from "@vercel/blob";

import { Prompt } from "@/app/components/prompt/types";
import { CV } from "@/app/components/table/types";

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
        roles: [prompt],
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

export async function PUT(request: Request): Promise<NextResponse> {
  const { id, prompt }: { id: string; prompt: Prompt } = await request.json();

  try {
    const cvs: CV[] = await redis.lrange("cvs", 0, -1);
    const cvIndex = cvs.findIndex((cv) => cv.id === id);

    if (cvIndex !== -1) {
      const cv = cvs[cvIndex];
      cv.roles.push(prompt);
      await redis.lset("cvs", cvIndex, JSON.stringify(cv));
    }

    const updatedCvs = await redis.lrange("cvs", 0, -1);

    return NextResponse.json({ data: updatedCvs });
  } catch (error) {
    return NextResponse.json(
      { message: `Error uploading cv to database: ${error}` },
      { status: 500 }
    );
  }
}
