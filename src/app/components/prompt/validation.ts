import { Prompt } from "@/app/components/prompt/types";

const minCharsMessage = "Must be at least 2 characters long";

/**
 * Validates the name of a prompt.
 * @param name - The name of the prompt to validate.
 * @param prompts - The list of existing prompts.
 * @returns An error message if the name is invalid, otherwise undefined.
 */

export const validateName = (
  name: string,
  prompts: Prompt[]
): string | undefined => {
  const existingPrompt = prompts.some(
    (prompt) => prompt.name.toLowerCase() === name.trim().toLowerCase()
  );
  const nameLength = name.trim().length;
  if (nameLength < 2) return minCharsMessage;
  if (nameLength > 20) return "Name must be at most 20 characters long.";
  if (existingPrompt) return "A prompt with this name already exists.";
  return;
};

/**
 * Validates the description of a prompt.
 * @param description - The description of the prompt to validate.
 * @returns An error message if the description is invalid, otherwise undefined.
 */
export const validateDescription = (
  description: string
): string | undefined => {
  const descriptionLength = description.trim().length;
  if (descriptionLength < 2) return minCharsMessage;
  if (descriptionLength > 40)
    return "Description must be at most 40 characters long.";
  return;
};
