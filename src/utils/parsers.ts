import mammoth from "mammoth";
import "pdfjs-dist/webpack";
import * as pdfjs from "pdfjs-dist";
import { toast } from "@/components/ui/sonner";

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
    toast.error(`Error extracting text from ${file.name} file`);
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
    toast.error(`Error extracting text from ${file.name} file`);
    throw error;
  }
};
