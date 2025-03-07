import { put, list } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const fileHash = searchParams.get("fileHash") ?? "";

    if (fileHash && request.body) {
      const blob = await put(fileHash, request.body, {
        access: "public",
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
    return NextResponse.json(blobs);
  } catch (error) {
    console.error("Error in GET request:", error);
    return NextResponse.json(
      { message: `Error occurred while fetching blob: ${error}` },
      { status: 500 }
    );
  }
}
