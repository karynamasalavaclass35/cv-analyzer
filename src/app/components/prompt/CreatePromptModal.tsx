"use client";

import { useState } from "react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Prompt } from "@/app/components/prompt/types";
import { getPromptSchema } from "@/app/components/prompt/validationSchema";

type Props = {
  prompts: Prompt[];
  onSetPrompts: (prompts: Prompt[]) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const CreatePromptModal = ({
  open,
  setOpen,
  prompts,
  onSetPrompts,
}: Props) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<{
    name?: string;
    description?: string;
  }>({});

  const handleCreatePrompt = async () => {
    setFormErrors({});

    const validationResult = getPromptSchema(prompts).safeParse({
      name,
      description,
    });

    if (!validationResult.success) {
      validationResult.error.errors.forEach((error) => {
        setFormErrors((prev) => ({
          ...prev,
          [error.path[0]]: error.message,
        }));
      });
      return;
    }

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

      toast.success("Prompt created successfully");
      resetForm();
      setOpen(false);
    } else {
      toast.error("Error creating prompt");
    }

    setIsLoading(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetForm();
    }
    setOpen(open);
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setFormErrors({});
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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
          className="flex flex-col mt-4 space-y-4"
          onSubmit={handleCreatePrompt}
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">
              Name
              <RequiredFieldIndicator />
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setFormErrors((prev) => ({ ...prev, name: undefined }));
              }}
            />
            {formErrors.name && <ErrorMessage message={formErrors.name} />}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="description">
              Description
              <RequiredFieldIndicator />
            </Label>
            <textarea
              id="description"
              className="w-full"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setFormErrors((prev) => ({ ...prev, description: undefined }));
              }}
            />
            {formErrors.description && (
              <ErrorMessage message={formErrors.description} />
            )}
          </div>

          <Button type="submit" disabled={isLoading} loading={isLoading}>
            Create
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const RequiredFieldIndicator = () => <span className="text-red-500">*</span>;

const ErrorMessage = ({ message }: { message: string }) => (
  <p className="text-sm text-red-500">{message}</p>
);
