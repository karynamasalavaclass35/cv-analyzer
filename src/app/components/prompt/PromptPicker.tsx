"use client";

import { Combobox } from "@/components/custom/combobox";
import { useEffect, useState } from "react";
import { CreatePromptModal } from "./CreatePromptModal";
import { Label } from "@/components/ui/label";

const prompts = [
  {
    value: "react developer",
    label: "React developer",
    description: "You are a react developer",
  },
  {
    value: "angular developer",
    label: "Angular developer",
    description: "You are a angular developer",
  },
  {
    value: "vue developer",
    label: "Vue developer",
    description: "You are a vue developer",
  },
  {
    value: "backend developer",
    label: "Backend developer",
    description:
      "You are a backend developer You are a backend developer You are a backend developer You are a backend developer You are a backend developer You are a backend developer You are a backend developer You are a backend developer You are a backend developer",
  },
];

export function PromptPicker() {
  // const [prompts, setPrompts] = useState([]);
  const [role, setRole] = useState(prompts?.[0]?.value ?? "");

  // const getPrompts = async () => {
  //   const response = await fetch(`/api/redis?key=prompts`, { method: "GET" });

  //   if (response.ok) {
  //     setPrompts(await response.json());
  //   } else {
  //     const error = await response.json();
  //     console.error("Error fetching data from Redis:", error);
  //   }
  // };

  console.log("prompts", prompts);

  const description = prompts.find(
    (prompt) => prompt.value === role
  )?.description;

  // todo:
  // useEffect(() => {
  //   getPrompts();
  // }, []);

  const handleOpenCreationModal = () => {
    console.log("add");
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
        options={prompts}
        noResultsContent={<CreatePromptModal />}
      />
      {role && <textarea value={description} disabled />}
    </div>
  );
}
