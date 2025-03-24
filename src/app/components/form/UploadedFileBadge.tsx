import {
  CircleCheck,
  CircleX,
  LoaderCircle,
  RefreshCw,
  Trash2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { FileStatus, FileStatusRecord } from "@/app/types";

type Props = {
  fileStatus: FileStatusRecord;
  file: File;
  onRemove: (file: File) => void;
  onRerunAnalysis: (file: File) => void;
};

export function UploadedFileBadge({
  fileStatus,
  file,
  onRemove,
  onRerunAnalysis,
}: Props) {
  const status = fileStatus[file.name];

  return (
    <Badge
      variant="secondary"
      className="flex gap-2 text-sm items-center justify-center"
    >
      <span className="text-indigo-900 max-w-[200px] truncate">
        {file.name}
      </span>
      <StatusIcon
        status={status}
        onRemove={onRemove}
        file={file}
        size={12}
        onRerunAnalysis={onRerunAnalysis}
      />
    </Badge>
  );
}

const StatusIcon = ({
  status,
  onRemove,
  file,
  size,
  onRerunAnalysis,
}: {
  status: FileStatus;
  onRemove: (file: File) => void;
  file: File;
  size: number;
  onRerunAnalysis: (file: File) => void;
}) => {
  if (!status) {
    return (
      <Trash2
        className="text-indigo-950 hover:text-red-800 cursor-pointer"
        onClick={() => onRemove(file)}
        aria-label="Remove file"
        size={size}
      />
    );
  }

  if (status === "loading")
    return <LoaderCircle className="animate-spin" size={size} />;
  if (status === "done")
    return <CircleCheck className="text-green-600" size={size} />;

  if (status === "error") {
    return (
      <div className="flex items-center gap-2">
        <CircleX className="text-red-600" size={size} />
        <RefreshCw
          className="text-indigo-500 cursor-pointer hover:opacity-80"
          size={size}
          onClick={() => onRerunAnalysis(file)}
        />
      </div>
    );
  }
};
