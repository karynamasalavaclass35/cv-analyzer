"use client";

import { useEffect, useMemo, useState } from "react";

import { Combobox } from "@/components/custom/combobox";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { CreatePromptModal } from "@/app/components/prompt/CreatePromptModal";
import { Prompt } from "@/app/components/prompt/types";

type Props = {
  prompt?: Prompt;
  onSetPrompt: (prompt?: Prompt) => void;
};

export function PromptPicker({ prompt, onSetPrompt }: Props) {
  const [prompts, setPrompts] = useState<Prompt[]>([]);

  const mappedPrompts = useMemo(
    () =>
      prompts.map(({ name, description }) => ({
        value: name.toLowerCase(),
        label: name,
        description,
      })),
    [prompts]
  );

  useEffect(() => {
    getPrompts();
  }, []);

  const getPrompts = async () => {
    const response = await fetch(`/api/prompts`, { method: "GET" });

    if (response.ok) {
      const result = await response.json();
      setPrompts(result);
      onSetPrompt({
        ...result?.[0],
        name: result?.[0]?.name.toLowerCase(),
      });
    } else {
      const error = await response.json();
      toast.error("Error fetching data from Redis:", error);
    }
  };

  const handleSetNewPrompt = (value: string) => {
    const selectedPrompt = mappedPrompts.find(
      (prompt) => prompt.value === value.toLowerCase()
    );

    if (selectedPrompt) {
      onSetPrompt({
        name: selectedPrompt.label.toLowerCase(),
        id: selectedPrompt.value,
        description: selectedPrompt.description,
      });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Label htmlFor="role" className="text-gray-800">
        Role
      </Label>
      <Combobox
        id="role"
        value={prompt?.name ?? ""}
        onSetValue={handleSetNewPrompt}
        options={mappedPrompts}
        noResultsContent={
          <CreatePromptModal prompts={prompts} onSetPrompts={setPrompts} />
        }
      />
      {!!prompt && <textarea value={prompt.description} disabled />}
    </div>
  );
}
