import mammoth from "mammoth";
import "pdfjs-dist/webpack";
import * as pdfjs from "pdfjs-dist";

export const extractFromPDF = async (file: File): Promise<string> => {
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

export const extractFromDocx = async (filePath: string) => {
  const data = await mammoth.extractRawText({ path: filePath });
  return data.value;
};
