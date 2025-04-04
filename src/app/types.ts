import { PutBlobResult } from "@vercel/blob";

export type OllamaResponse = {
  model: string;
  created_at: string;
  response: any;
  done: boolean;
  context: number[];
  total_duration: number;
  load_duration: number;
  prompt_eval_count: number;
  prompt_eval_duration: number;
  eval_count: number;
  eval_duration: number;
};

export type Analysis = {
  fileName: string;
  pros: string[];
  cons: string[];
  fitPercentage: number;
  feedback: string;
};

export interface ExtendedPutBlobResult extends PutBlobResult {
  analysis: Analysis;
}

export type FileStatus = "loading" | "error" | "done";
export type FileStatusRecord = Record<string, FileStatus>;
