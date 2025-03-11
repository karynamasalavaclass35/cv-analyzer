import mammoth from "mammoth";
import "pdfjs-dist/webpack";
import * as pdfjs from "pdfjs-dist";
import { type PutBlobResult } from "@vercel/blob";
import { Analysis } from "@/app/types";

export const parsePdfToString = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument(arrayBuffer).promise;
    let text = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((item: any) => item.str).join(" ") + "\n";
    }

    return text;
  } catch (error) {
    console.error("Error extracting text:", error);
    throw error;
  }
};

export const parseDocumentToString = async (file: File) => {
  try {
    const data = await mammoth.extractRawText({
      arrayBuffer: await file.arrayBuffer(),
    });
    return data.value;
  } catch (error) {
    console.error("Error extracting text from document:", error);
    throw error;
  }
};

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
  const response = await fetch(`/api/analysis`, {
    method: "GET",
  });
  return await response.json();
};
