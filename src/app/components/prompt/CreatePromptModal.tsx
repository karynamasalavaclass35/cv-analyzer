"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
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
export const CreatePromptModal = () => {
  const [open, setOpen] = useState(false);

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
        </DialogHeader>

        <DialogDescription className="flex flex-col gap-4 mt-4">
          <Label htmlFor="name">Name</Label>
          <Input id="name" />

          <Label htmlFor="description">Description</Label>
          <textarea id="description" />
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};
