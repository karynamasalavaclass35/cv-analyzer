import { Loader2 } from "lucide-react";

export function Loading() {
  return (
    <div className="bg-white text-indigo-900 rounded-lg w-full h-40 flex items-center justify-center">
      <Loader2 className="w-10 h-10 animate-spin" />
    </div>
  );
}
