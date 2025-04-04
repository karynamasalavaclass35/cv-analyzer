import { CV } from "@/app/components/table/types";
import { toast } from "@/components/ui/sonner";
import { ListBlobResultBlob, PutBlobResult } from "@vercel/blob";

export const saveCvToBlob = async (cv: File): Promise<PutBlobResult> => {
  const formData = new FormData();
  formData.append("file", cv);

  const response = await fetch(`/api/blobs?create`, {
    method: "POST",
    body: formData,
  });

  const { data } = await response.json();

  return data;
};

export const getBlobsData = async () => {
  const response = await fetch("/api/blobs", {
    method: "GET",
  });
  return await response.json();
};

export const deleteCvFromBlob = async (cv: CV): Promise<void> => {
  try {
    await fetch("/api/blobs?delete", {
      method: "DELETE",
      body: JSON.stringify({ blobUrl: cv.url }),
    });
  } catch (error) {
    toast.error("Failed to delete CV analysis data");
  }
};

export const getBlobFileData = (blob: PutBlobResult | ListBlobResultBlob) => {
  // the pathname is like this: "1234567890-cv.pdf" (hash-fileName)
  const splittedPathname = blob.pathname.split("-");
  return { fileName: splittedPathname[1], savedHash: splittedPathname[0] };
};
