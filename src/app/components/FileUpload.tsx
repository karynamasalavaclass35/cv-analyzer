"use client";

import { useState } from "react";

export default function FileUpload() {
  const [prompt, setPrompt] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);

  const uploadCV = async (cvFile: File) => {
    const formData = new FormData();
    formData.append("file", cvFile);
    formData.append("purpose", "cv-analysis");

    const response = await fetch("http://localhost:5002/v1/files", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload CV");
    }

    return await response.json();
  };

  const analyzeCV = async (fileId: string, jobDescription: string) => {
    const analysisRequest = {
      model: "gpt-3.5-turbo",
      prompt: `Please analyze the CV in file ${fileId} and determine if it matches the following job description: ${jobDescription}. Please provide detailed feedback.`,
    };

    const response = await fetch("http://localhost:5002/v1/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(analysisRequest),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Failed to analyze CV");
    }

    const result = await response.json();

    if (result.choices?.[0]) {
      const choice = result.choices[0];

      if (!choice.text && choice.message) {
        choice.text = choice.message.content;
      }
    }

    return result;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;

    try {
      setLoading(true);

      const { id: cvId } = await uploadCV(file);
      const { choices } = await analyzeCV(cvId, prompt);

      if (choices?.[0]) {
        setAnalysis(choices[0].text ?? "No analysis available");
      } else {
        throw new Error("Invalid response format from analysis");
      }
    } catch (error) {
      console.error("Error:", error);
      alert(error instanceof Error ? error.message : "Failed to process CV");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full items-center">
      <form
        className="p-10 bg-gray-100 rounded-lg w-1/2 flex flex-col gap-4"
        onSubmit={handleSubmit}
      >
        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              PDF, DOC, DOCX
            </p>
            {file && (
              <p className="mt-2 text-sm text-blue-500 font-medium">
                Selected: {file.name}
              </p>
            )}
          </div>
          <input
            id="dropzone-file"
            type="file"
            className="hidden"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </label>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full h-40 border border-gray-300 text-sm rounded-lg p-2 resize-none focus:outline-none"
          placeholder="Enter the job description..."
        />

        <button
          type="submit"
          className="self-end w-fit bg-blue-500 text-white p-2 rounded-md cursor-pointer mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!file || !prompt || loading}
        >
          {loading ? "Analyzing..." : "Upload CV"}
        </button>
      </form>

      {analysis && (
        <div className="p-6 bg-white rounded-lg w-1/2">
          <h2 className="text-xl font-semibold mb-4">Analysis Result</h2>
          <p className="whitespace-pre-wrap">{analysis}</p>
        </div>
      )}
    </div>
  );
}
