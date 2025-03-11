"use client";

import { useState } from "react";
import crypto from "crypto";
import { PutBlobResult } from "@vercel/blob";
import { FileUp, Trash2 } from "lucide-react";

import { ExtendedPutBlobResult, OllamaResponse } from "@/app/types";
import {
  parseDocumentToString,
  parsePdfToString,
  saveAnalysisToBlob,
} from "@/app/helpers";
import { toast } from "@/components/ui/sonner";
import { Badge } from "@/components/ui/badge";

export function UploadForm({
  blobData,
}: {
  blobData: ExtendedPutBlobResult[];
}) {
  const [requiredPosition, setRequiredPosition] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  const analyzeCV = async (
    cvText: string,
    requiredPosition: string
  ): Promise<OllamaResponse> => {
    try {
      const response = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama3.2",
          stream: false,
          format: "json",
          prompt: `Please analyze the CV content: "${cvText}". Determine if it fits the position and its requirements: "${requiredPosition}". Please provide a feedback consisting only of the following fields: pros, cons, fitPercentage and feedback`,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to analyze CV");
      }

      return await response.json();
    } catch (error) {
      console.error("Error analyzing CV:", error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!files.length) return;

    try {
      files.forEach(async (file) => {
        const cvText =
          file.type === "application/pdf"
            ? await parsePdfToString(file)
            : await parseDocumentToString(file);

        const hash = crypto.createHash("sha256").update(cvText).digest("hex");
        const isFileAlreadyInBlob = !!blobData.find(
          (item: PutBlobResult) => item.pathname === hash
        );

        if (isFileAlreadyInBlob) {
          toast.info(
            `File ${file.name} has already been analysed, check the database`
          );
        } else {
          const { response } = await analyzeCV(cvText, requiredPosition);
          const parsedAnalysis = JSON.parse(response);
          saveAnalysisToBlob({ fileName: file.name, ...parsedAnalysis }, hash);
        }
      });
    } catch (error) {
      console.error("Error:", error);
      alert(error instanceof Error ? error.message : "Failed to process CV");
    }
  };

  const handleFileUploadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files ?? []);
    const uniqueFiles = newFiles.filter((newFile) => {
      const isDuplicate = files.some(
        (file) =>
          file.name === newFile.name &&
          file.size === newFile.size &&
          file.type === newFile.type
      );

      if (isDuplicate) {
        toast.info(`File ${newFile.name} has already been uploaded.`);
      }

      return !isDuplicate;
    });

    setFiles((files) => [...files, ...uniqueFiles]);
  };

  const handleDeleteFile = (file: File) => {
    setFiles((files) =>
      files.filter(({ name, size }) => name !== file.name && size !== file.size)
    );
  };

  return (
    <form
      className="p-10 bg-white rounded-lg w-full flex flex-col gap-4"
      onSubmit={handleSubmit}
    >
      <label
        htmlFor="dropzone-file"
        className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 gap-2">
          <FileUp size={32} className="text-gray-500" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold">Click to upload</span> or drag and
            drop
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            We accept PDF, DOC, DOCX files
          </p>
        </div>
        <input
          id="dropzone-file"
          type="file"
          className="hidden"
          accept=".pdf,.doc,.docx"
          multiple
          onChange={handleFileUploadChange}
        />
      </label>

      <div className="flex gap-2 w-full flex-wrap">
        {files.map((file) => (
          <p
            key={file.name + file.size}
            className="text-sm flex items-center justify-center gap-2"
          >
            <Badge variant="secondary" className="flex gap-2">
              <span className="text-indigo-900 max-w-50 truncate">
                {file.name}
              </span>
              <Trash2
                className="text-indigo-950 hover:opacity-50 cursor-pointer"
                onClick={() => handleDeleteFile(file)}
              />
            </Badge>
          </p>
        ))}
      </div>

      <textarea
        value={requiredPosition}
        onChange={(e) => setRequiredPosition(e.target.value)}
        className="w-full h-40 border border-gray-300 text-sm rounded-lg p-2 resize-none focus:outline-none"
        placeholder="Enter the job description..."
      />

      <button
        type="submit"
        className="self-end w-fit bg-indigo-600 text-white p-2 rounded-md cursor-pointer mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!files.length || !requiredPosition}
      >
        Analyse CV(s)
      </button>
    </form>
  );
}
