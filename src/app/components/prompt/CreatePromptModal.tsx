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
import { Prompt, FormErrors } from "@/app/components/prompt/types";
import {
  validateDescription,
  validateName,
} from "@/app/components/prompt/validation";

type Props = {
  prompts: Prompt[];
  onSetPrompts: (prompts: Prompt[]) => void;
};

export const CreatePromptModal = ({ prompts, onSetPrompts }: Props) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const isFormValid =
    formErrors.name === undefined &&
    formErrors.description === undefined &&
    Object.keys(formErrors).length !== 0;

  const handleCreatePrompt = async () => {
    setFormErrors({});

    const nameError = validateName(name, prompts);
    const descriptionError = validateDescription(description);

    if (nameError || descriptionError) {
      setFormErrors({ name: nameError, description: descriptionError });
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
          className="flex flex-col mt-4 space-y-4"
          onSubmit={handleCreatePrompt}
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">
              Name
              <RequiredFieldIndicator />
            </Label>
            <Input
              required
              id="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setFormErrors((prev) => ({
                  ...prev,
                  name: validateName(e.target.value, prompts),
                }));
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
              required
              id="description"
              className="w-full"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setFormErrors((prev) => ({
                  ...prev,
                  description: validateDescription(e.target.value),
                }));
              }}
            />
            {formErrors.description && (
              <ErrorMessage message={formErrors.description} />
            )}
          </div>

          <Button type="submit" disabled={!isFormValid || isLoading}>
            {isLoading ? "Creating..." : "Create"}
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
