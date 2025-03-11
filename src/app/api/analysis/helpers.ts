import { list } from "@vercel/blob";
import { NextResponse } from "next/server";

export const prepareBlobDataForUI = async () => {
  const { blobs } = await list();

  if (!blobs.length) {
    return NextResponse.json({ data: [] });
  }

  const data = await Promise.all(
    blobs.map(async (blob) => {
      const response = await fetch(blob.downloadUrl);
      const analysisData = await response.json();
      return { ...blob, analysis: { ...analysisData } };
    })
  );

  return NextResponse.json({ data });
};
