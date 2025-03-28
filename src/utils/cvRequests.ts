import { CV } from "@/app/components/table/types";
import { PutBlobResult } from "@vercel/blob";
import { getBlobFileData } from "./blobRequests";
import { Prompt } from "@/app/components/prompt/types";

const checkIfCvExistsInDB = async (hash: string): Promise<boolean> => {
  const response = await fetch(`/api/cvs`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const { data } = await response.json();
  const cvAlreadyExists = data.some((cv: CV) => cv.id === hash);

  return cvAlreadyExists;
};

export const saveCvToDB = async ({
  blob,
  fileName,
  prompt,
  onSetCvs,
}: {
  blob: PutBlobResult;
  fileName: string;
  prompt: Prompt;
  onSetCvs: (cvs: CV[]) => void;
}): Promise<void> => {
  const { savedHash } = getBlobFileData(blob);
  const cvExists = await checkIfCvExistsInDB(savedHash);

  if (cvExists) return;

  const response = await fetch(`/api/cvs`, {
    method: "POST",
    body: JSON.stringify({ id: savedHash, blob, fileName, prompt }),
  });

  const { data } = await response.json();

  onSetCvs(data);
};
