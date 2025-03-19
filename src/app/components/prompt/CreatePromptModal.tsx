"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Prompt } from "@/app/types";

export const CreatePromptModal = ({
  onSetPrompts,
}: {
  onSetPrompts: (prompts: Prompt[]) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCreatePrompt = async () => {
    setIsLoading(true);
    const response = await fetch("/api/prompts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, description }),
    });

    if (response.ok) {
      const { prompts } = await response.json();
      onSetPrompts(prompts);

      setName("");
      setDescription("");
      setOpen(false);
    } else {
      toast.error("Error creating prompt");
    }

    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="text-indigo-800 cursor-pointer hover:text-indigo-600"
          onClick={() => setOpen(true)}
        >
          <Plus />
          Add new prompt
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-indigo-800">
            Create new prompt
          </DialogTitle>
          <VisuallyHidden>
            <DialogDescription>Description goes here</DialogDescription>
          </VisuallyHidden>
        </DialogHeader>

        <form
          className="flex flex-col gap-4 mt-4"
          onSubmit={handleCreatePrompt}
        >
          <Label htmlFor="name">
            Name<span className="text-red-500">*</span>
          </Label>
          <Input
            required
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Label htmlFor="description">
            Description<span className="text-red-500">*</span>
          </Label>
          <textarea
            required
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <Button type="submit" disabled={!name || !description || isLoading}>
            {isLoading ? "Creating..." : "Create"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
