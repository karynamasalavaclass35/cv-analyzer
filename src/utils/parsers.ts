import mammoth from "mammoth";
import "pdfjs-dist/webpack";
import * as pdfjs from "pdfjs-dist";

import { toast } from "@/components/ui/sonner";

const parsePdfToString = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument(arrayBuffer).promise;
  let text = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map((item: any) => item.str).join(" ") + "\n";
  }

  return text;
};

const parseDocumentToString = async (file: File) => {
  const data = await mammoth.extractRawText({
    arrayBuffer: await file.arrayBuffer(),
  });
  return data.value;
};

export const parseCvToString = async (file: File): Promise<string> => {
  let cvText = "";

  try {
    cvText =
      file.type === "application/pdf"
        ? await parsePdfToString(file)
        : await parseDocumentToString(file);
  } catch (error) {
    toast.error(
      error instanceof Error
        ? `Failed to parse ${file.name}: ${error.message}`
        : `Failed to parse ${file.name}`
    );
  }

  return cvText;
};
