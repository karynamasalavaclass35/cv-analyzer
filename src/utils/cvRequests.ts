import { CV, Role } from "@/app/components/table/types";
import { Prompt } from "@/app/components/prompt/types";
import { createFileHash } from "@/utils";
import { saveCvToBlob } from "@/utils/blobRequests";
import { toast } from "@/components/ui/sonner";

const fetchCvs = async (): Promise<CV[]> => {
  const response = await fetch("/api/cvs", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const { data } = await response.json();
  return data;
};

export const saveCv = async (
  file: File,
  onSetCvs: (cvs: CV[]) => void,
  prompt: Prompt
): Promise<void> => {
  const hash = await createFileHash(file);
  const cvs = await fetchCvs();
  const cv = cvs.find((cv: CV) => cv.id === hash);
  const cvExists = !!cv;

  if (cvExists && prompt) {
    const cvAnalysedForThisRole = cv.roles.some(
      (role: Role) => role.id === prompt.id
    );

    if (cvAnalysedForThisRole) {
      toast.info("CV already analysed for this role");
      return;
    }

    const updatedCvs = await updateCv(cv.id, prompt);
    onSetCvs(updatedCvs);
  } else {
    const blob = await saveCvToBlob(file);

    if (blob && prompt) {
      const response = await fetch("/api/cvs?create", {
        method: "POST",
        body: JSON.stringify({ id: hash, blob, fileName: file.name, prompt }),
      });
      const { data } = await response.json();
      onSetCvs(data);
    }
  }
};

export const updateCv = async (cvId: string, prompt: Prompt): Promise<CV[]> => {
  const response = await fetch(`/api/cvs?update`, {
    method: "PUT",
    body: JSON.stringify({ id: cvId, prompt }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const { data } = await response.json();
  return data;
};
