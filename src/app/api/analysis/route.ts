import { put, list } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const fileHash = searchParams.get("fileHash") ?? "";

    if (fileHash && request.body) {
      const blob = await put(fileHash, request.body, {
        access: "public",
        contentType: "application/json",
      });

      return NextResponse.json(blob);
    }

    return NextResponse.json(
      { error: "No file hash or request body" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error in POST request:", error);
    return NextResponse.json(
      { message: `Error occurred during upload: ${error}` },
      { status: 500 }
    );
  }
}

export async function GET(): Promise<NextResponse> {
  try {
    const { blobs } = await list();

    if (!blobs.length) {
      return NextResponse.json({ data: [] });
    }

    const blobDataArray = await Promise.all(
      blobs.map(async (blob) => {
        const response = await fetch(blob.downloadUrl);
        const analysisData = await response.json();
        return { ...blob, analysis: { ...analysisData } };
      })
    );

    return NextResponse.json({ data: blobDataArray });
  } catch (error) {
    console.error("Error in GET request:", error);
    return NextResponse.json(
      { message: `Error occurred while fetching blob: ${error}` },
      { status: 500 }
    );
  }
}
