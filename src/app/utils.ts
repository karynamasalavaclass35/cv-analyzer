import mammoth from "mammoth";
import "pdfjs-dist/webpack";
import * as pdfjs from "pdfjs-dist";
import { type PutBlobResult } from "@vercel/blob";

export const processTextStreaming = async (
  response: Response,
  onSetAnalysis: (text: string) => void
) => {
  const reader = response.body?.getReader();

  if (!reader) throw new Error("No reader available");

  let fullResponse = "";
  let streamComplete = false;
  const decoder = new TextDecoder();

  while (!streamComplete) {
    const { done, value } = await reader.read();

    if (done) {
      streamComplete = true;
      break;
    }

    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split("\n").filter((line) => line.trim() !== "");

    let newResponse = "";

    for (const line of lines) {
      try {
        const data = JSON.parse(line);
        if (data.response) {
          newResponse += data.response;
        }
      } catch (e) {
        console.error("Error parsing chunk:", e);
      }
    }

    if (newResponse) {
      fullResponse += newResponse;
      onSetAnalysis(fullResponse);
    }
  }

  return fullResponse;
};

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
  fileContent: string,
  hash: string
): Promise<PutBlobResult> => {
  const dataToUpload = JSON.stringify({
    fileContent,
    matchPercentage: "67%", // fixme: hardcoded for now
    pros: ["Pro 1", "Pro 2"],
    cons: ["Con 1", "Con 2"],
    feedback: "Feedback 1",
  });

  const response = await fetch(`/api/analysis?fileHash=${hash}`, {
    method: "POST",
    body: dataToUpload,
  });

  return await response.json();
};

export const getBlobData = async () => {
  const response = await fetch(`/api/analysis`, {
    method: "GET",
  });
  return await response.json();
};
