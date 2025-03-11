import { Analysis } from "@/app/types";
import { PutBlobResult } from "@vercel/blob";

export const saveAnalysisToBlob = async (
  analysis: Analysis,
  hash: string
): Promise<PutBlobResult> => {
  const response = await fetch(`/api/analysis?fileHash=${hash}`, {
    method: "POST",
    body: JSON.stringify(analysis),
  });

  return await response.json();
};

export const getBlobData = async () => {
  const response = await fetch("/api/analysis", {
    method: "GET",
  });
  return await response.json();
};

export const deleteCVAnalysisData = async (blobUrl: string) => {
  const response = await fetch("/api/analysis", {
    method: "DELETE",
    body: JSON.stringify({ blobUrl }),
  });
  return await response.json();
};
