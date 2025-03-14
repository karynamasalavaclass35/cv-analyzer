"use client";

import { useState } from "react";
import crypto from "crypto";
import { PutBlobResult } from "@vercel/blob";
import { FileUp } from "lucide-react";

import {
  ExtendedPutBlobResult,
  FileStatus,
  FileStatusRecord,
  OllamaResponse,
} from "@/app/types";
import { parseCvToString } from "@/utils/parsers";
import { saveAnalysisToBlob } from "@/utils/requests";
import { toast } from "@/components/ui/sonner";
import { UploadedFileBadge } from "@/app/components/UploadedFileBadge";

export function UploadForm({
  blobData,
}: {
  blobData: ExtendedPutBlobResult[];
}) {
  const [requiredPosition, setRequiredPosition] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [fileStatus, setFileStatus] = useState<FileStatusRecord>({});

  const isAnyFileLoading = files.some(
    (file) => fileStatus[file.name] === "loading"
  );

  const validateCvAgainstPosition = async (
    cvText: string,
    requiredPosition: string,
    fileName: string
  ): Promise<OllamaResponse> => {
    setFileStatus((prev) => ({ ...prev, [fileName]: "loading" }));

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/generate`,
        {
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
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setFileStatus((prev) => ({ ...prev, [fileName]: "error" }));
        throw new Error(errorData.message || "Failed to analyze CV");
      }

      const result = await response.json();
      setFileStatus((prev) => ({ ...prev, [fileName]: "done" }));
      return result;
    } catch (error) {
      setFileStatus((prev) => ({ ...prev, [fileName]: "error" }));
      throw new Error(
        error instanceof Error ? error.message : "Failed to analyze CV"
      );
    }
  };

  const runFileAnalysis = async (file: File): Promise<FileStatus> => {
    const cvText = await parseCvToString(file);

    if (!cvText) return "error";

    const hash = crypto.createHash("sha256").update(cvText).digest("hex");
    const isFileAlreadyInBlob = !!blobData.find(
      (item: PutBlobResult) => item.pathname === hash
    );

    if (isFileAlreadyInBlob) {
      toast.info(
        `File ${file.name} has already been analysed, see the analysis in the table below`
      );
      return "done";
    } else {
      try {
        const { response } = await validateCvAgainstPosition(
          cvText,
          requiredPosition,
          file.name
        );
        const parsedAnalysis = JSON.parse(response);

        if (!Object.keys(parsedAnalysis).length) {
          throw new Error(`${file.name}: received empty analysis response`);
        }

        saveAnalysisToBlob({ fileName: file.name, ...parsedAnalysis }, hash);
        return "done";
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : `Failed to analyze ${file.name}`
        );
        return "error";
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!files.length) return;

    try {
      const newFileStatus: FileStatusRecord = {};

      for (const file of files) {
        const result = await runFileAnalysis(file);
        newFileStatus[file.name] = result;
      }

      setFileStatus(newFileStatus);

      const allDone = Object.values(newFileStatus).every(
        (status) => status === "done"
      );

      if (allDone) {
        toast.success("All files have been analysed");
        resetForm();
      } else {
        filterFileBadges(newFileStatus);
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? `Failed to process CV: ${error.message}`
          : "Failed to process CV"
      );
    }
  };

  const filterFileBadges = (newFileStatus: FileStatusRecord) => {
    setFiles((files) =>
      files.filter((file) => newFileStatus[file.name] !== "done")
    );
    setFileStatus((prev) => {
      const newStatus = { ...prev };
      for (const key in newStatus) {
        if (newStatus[key] === "done") {
          delete newStatus[key];
        }
      }
      return newStatus;
    });
  };

  const resetForm = () => {
    setFiles([]);
    setRequiredPosition("");
    setFileStatus({});
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

  const handleRemoveUploadedFile = (file: File) => {
    setFiles((files) =>
      files.filter(({ name, size }) => name !== file.name && size !== file.size)
    );
  };

  return (
    <div className="flex justify-center">
      <form
        className="p-10 bg-white rounded-lg w-full flex flex-col gap-4 xl:w-1/2"
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
            <UploadedFileBadge
              key={file.name + file.size}
              file={file}
              fileStatus={fileStatus}
              onRemove={handleRemoveUploadedFile}
              onRerunAnalysis={async () => await runFileAnalysis(file)}
            />
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
          className="self-center w-fit bg-indigo-600 text-white p-2 rounded-md cursor-pointer mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!files.length || !requiredPosition || isAnyFileLoading}
        >
          {isAnyFileLoading ? "Analysing..." : "Analyse CV(s)"}
        </button>
      </form>
    </div>
  );
}
