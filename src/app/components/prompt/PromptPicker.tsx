"use client";

import { useEffect, useMemo, useState } from "react";

import { Combobox } from "@/components/custom/combobox";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { CreatePromptModal } from "@/app/components/prompt/CreatePromptModal";
import { Prompt } from "@/app/components/prompt/types";
import { ConfirmationDialog } from "@/components/custom/confirmation-dialog";

type Props = {
  prompt?: Prompt;
  onSetPrompt: (prompt?: Prompt) => void;
};

export function PromptPicker({ prompt, onSetPrompt }: Props) {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [removePromptModalOpen, setRemovePromptModalOpen] = useState(false);
  const [promptToRemove, setPromptToRemove] = useState<Prompt | null>(null);
  const [loading, setLoading] = useState(false);

  const mappedPrompts = useMemo(
    () =>
      prompts.map(({ name, description, id }) => ({
        value: id,
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
      const result: Prompt[] = await response.json();
      setPrompts(result);
      onSetPrompt(result?.[0]);
    } else {
      const error = await response.json();
      toast.error("Error fetching data from Redis:", error);
    }
  };

  const handleSetNewPrompt = (value: string) => {
    const selectedPrompt = mappedPrompts.find(
      (prompt) => prompt.value === value
    );

    if (selectedPrompt) {
      onSetPrompt({
        name: selectedPrompt.label,
        id: selectedPrompt.value,
        description: selectedPrompt.description,
      });
    }
  };

  const handleRemovePrompt = async (id: string) => {
    setLoading(true);

    const response = await fetch("/api/prompts", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    if (response.ok) {
      const { prompts } = await response.json();
      setPrompts(prompts);

      if (id === prompt?.id) {
        onSetPrompt(prompts?.[0]);
      }

      setPromptToRemove(null);
      setRemovePromptModalOpen(false);
      toast.success("Prompt removed successfully");
    } else {
      const error = await response.json();
      toast.error("Error deleting prompt", error);
    }

    setLoading(false);
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        <Label htmlFor="role" className="text-gray-800">
          Role
        </Label>
        <Combobox
          id="role"
          value={prompt?.id ?? ""}
          onSetValue={handleSetNewPrompt}
          options={mappedPrompts}
          noResultsContent={
            <CreatePromptModal prompts={prompts} onSetPrompts={setPrompts} />
          }
          onRemoveOption={(id) => {
            const promptToDelete = prompts.find((prompt) => prompt.id === id);
            setPromptToRemove(promptToDelete || null);
            setRemovePromptModalOpen(true);
          }}
        />
        {!!prompt && <textarea value={prompt.description} disabled />}
      </div>

      <ConfirmationDialog
        open={removePromptModalOpen}
        description={`This action cannot be undone. Do you want to remove the prompt "${promptToRemove?.name}"?`}
        onOpenChange={setRemovePromptModalOpen}
        onConfirm={() => {
          promptToRemove && handleRemovePrompt(promptToRemove.id);
        }}
        confirmText="Remove"
        loading={loading}
      />
    </>
  );
}
