import { useState } from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Props = {
  options: { value: string; label: string }[];
  noResultsActionButton?: React.ReactNode;
  id?: string;
  value: string;
  onSetValue: (value: string) => void;
  enableOptionRemoval?: boolean;
  onRemoveOption?: (value: string) => void;
};

export function Combobox({
  options,
  noResultsActionButton,
  id,
  value,
  onSetValue,
  enableOptionRemoval = true,
  onRemoveOption,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between text-indigo-800"
          id={id}
        >
          {value
            ? options.find((option) => option.value === value)?.label
            : "Select option..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command
          filter={(_, search, keywords = []) =>
            keywords.join("").toLowerCase().includes(search.toLowerCase())
              ? 1
              : 0
          }
        >
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandEmpty className="text-center p-2">
              {noResultsActionButton ?? "No results found"}
            </CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  keywords={[option.label]}
                  className="cursor-pointer group"
                  onSelect={(currentValue) => {
                    if (currentValue !== value) {
                      onSetValue(currentValue);
                    }
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                  {enableOptionRemoval && (
                    <span
                      className="ml-auto p-1 opacity-0 group-hover:opacity-100 hover:bg-red-100 hover:rounded-full transition-all duration-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveOption?.(option.value);
                      }}
                    >
                      <X className="text-red-500 h-4 w-4" />
                    </span>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
