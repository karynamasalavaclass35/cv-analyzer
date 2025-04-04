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

/**
 * Saves a CV to the database
 * @param file - The file to save
 * @param onSetCvs - The function to call when the CV is saved
 * @param prompt - The prompt to use for the CV analysis
 * @returns void or null if the CV already analysed for this role
 */
export const saveCv = async (
  file: File,
  prompt: Prompt
): Promise<CV[] | null> => {
  const hash = await createFileHash(file);
  const cvs = await fetchCvs();
  const cv = cvs.find((cv: CV) => cv.id === hash);
  const cvExists = !!cv;

  if (cvExists && prompt) {
    const cvAnalysedForThisRole = cv.roles.some(
      (role: Role) => role.id === prompt.id
    );

    if (cvAnalysedForThisRole) {
      toast.info(`File ${file.name} already analysed for ${prompt.name} role`);
      return null;
    }

    return await updateCv(cv.id, prompt);
  } else {
    const blob = await saveCvToBlob(file);

    if (blob && prompt) {
      const response = await fetch("/api/cvs?create", {
        method: "POST",
        body: JSON.stringify({ id: hash, blob, fileName: file.name, prompt }),
      });
      const { data } = await response.json();
      return data;
    }
  }

  return null;
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

export const deleteCv = async (cvId: string): Promise<CV[]> => {
  const response = await fetch(`/api/cvs?delete`, {
    method: "DELETE",
    body: JSON.stringify({ id: cvId }),
  });
  const { data } = await response.json();
  return data;
};

export const deleteCvRole = async (
  cvId: string,
  roleId: string
): Promise<CV[]> => {
  const response = await fetch(`/api/cvs?deleteRole`, {
    method: "DELETE",
    body: JSON.stringify({ id: cvId, roleId }),
  });
  const { data } = await response.json();
  return data;
};
