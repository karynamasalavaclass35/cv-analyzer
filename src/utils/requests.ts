import { Analysis, ExtendedPutBlobResult } from "@/app/types";
import { toast } from "@/components/ui/sonner";
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

export const deleteCVAnalysisData = async (
  blob: ExtendedPutBlobResult,
  onSetBlobData: (blobData: ExtendedPutBlobResult[]) => void
): Promise<void> => {
  try {
    const response = await fetch("/api/analysis", {
      method: "DELETE",
      body: JSON.stringify({ blobUrl: blob.url }),
    });
    const responseJson = await response.json();
    onSetBlobData(responseJson.data);
    toast.success(
      `${blob.analysis.fileName} file analysis deleted successfully`
    );
  } catch (error) {
    toast.error("Failed to delete CV analysis data");
  }
};
