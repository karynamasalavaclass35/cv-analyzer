import { z } from "zod";

import { Prompt } from "@/app/components/prompt/types";

const minCharsMessage = "Must be at least 2 characters long";
const requiredMessage = "This field is required";

export const getPromptSchema = (existingPrompts: Prompt[]) =>
  z.object({
    name: z
      .string()
      .min(2, minCharsMessage)
      .max(20, "Must be at most 20 characters long")
      .nonempty(requiredMessage)
      .refine(
        (name) =>
          !existingPrompts.some(
            (prompt) => prompt.name.toLowerCase() === name.toLowerCase()
          ),
        { message: "A prompt with this name already exists" }
      ),
    description: z
      .string()
      .min(2, minCharsMessage)
      .max(120, "Must be at most 120 characters long")
      .nonempty(requiredMessage),
  });
