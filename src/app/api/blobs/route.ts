import { put, list, del } from "@vercel/blob";
import { NextResponse } from "next/server";

import { getBlobFileData } from "@/utils/blobRequests";
import { createFileHash } from "@/utils";

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

  const hash = await createFileHash(file);

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
      { message: `Error uploading file to blob storage: ${error}` },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request): Promise<NextResponse> {
  try {
    const res = await request.json();

    if (!res.blobUrl) {
      return NextResponse.json(
        { message: "No blob URL provided" },
        { status: 400 }
      );
    }

    await del(res.blobUrl);
    const { blobs } = await list();
    return NextResponse.json({ data: blobs });
  } catch (error) {
    return NextResponse.json(
      { message: `Error occurred during deletion from blob storage: ${error}` },
      { status: 500 }
    );
  }
}
