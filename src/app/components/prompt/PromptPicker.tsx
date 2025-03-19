"use client";

import { Combobox } from "@/components/custom/combobox";
import { useEffect, useMemo, useState } from "react";
import { CreatePromptModal } from "./CreatePromptModal";
import { Label } from "@/components/ui/label";
import { Prompt } from "@/app/types";
import { toast } from "sonner";

export function PromptPicker() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [role, setRole] = useState("");

  const mappedPrompts = useMemo(
    () =>
      prompts.map((prompt) => ({
        value: prompt.name.toLowerCase(),
        label: prompt.name,
        description: prompt.description,
      })),
    [prompts]
  );

  const description = mappedPrompts.find(
    (prompt) => prompt.value === role
  )?.description;

  useEffect(() => {
    getPrompts();
  }, []);

  const getPrompts = async () => {
    const response = await fetch(`/api/prompts`, { method: "GET" });

    if (response.ok) {
      const result = await response.json();
      setPrompts(result);
      setRole(result?.[0]?.name.toLowerCase() ?? "");
    } else {
      const error = await response.json();
      toast.error("Error fetching data from Redis:", error);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Label htmlFor="role" className="text-gray-800">
        Role
      </Label>
      <Combobox
        id="role"
        value={role}
        onSetValue={setRole}
        options={mappedPrompts}
        noResultsContent={<CreatePromptModal onSetPrompts={setPrompts} />}
      />
      {role && <textarea value={description} disabled />}
    </div>
  );
}
