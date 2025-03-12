import _ from "lodash";
import { Trash2 } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ExtendedPutBlobResult } from "@/app/types";
import { cn } from "@/lib/utils";
import { deleteCVAnalysisData } from "@/utils/requests";

type Props = {
  blobStorageData: ExtendedPutBlobResult[];
  onSetBlobData: (blobData: ExtendedPutBlobResult[]) => void;
};

export function AnalysisTable({ blobStorageData, onSetBlobData }: Props) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="text-indigo-900 w-full">
          {Object.keys(blobStorageData[0].analysis).map((column, index) => (
            <TableHead key={column} className={cn("text-indigo-800")}>
              {_.startCase(column)}
            </TableHead>
          ))}
          <TableHead key="head_actions" className={cn("text-indigo-800")} />
        </TableRow>
      </TableHeader>

      <TableBody>
        {blobStorageData.map((blob) => {
          const analysis = blob.analysis;
          const values = Object.values(analysis);
          return (
            <TableRow key={blob.pathname} className="w-full">
              {values.map((value: any, index: number) => (
                <TableCell key={index}>
                  {Array.isArray(value) ? (
                    value.length > 0 ? (
                      <ol className="list-decimal list-inside">
                        {value.map((item) =>
                          typeof item === "string" ? (
                            <li key={item}>{item}</li>
                          ) : (
                            "N/A"
                          )
                        )}
                      </ol>
                    ) : (
                      "N/A"
                    )
                  ) : (
                    value ?? "N/A"
                  )}
                </TableCell>
              ))}
              <TableCell key="body_actions" className="text-center">
                <Trash2
                  size={16}
                  className="cursor-pointer text-indigo-900 hover:text-red-800"
                  onClick={async () =>
                    await deleteCVAnalysisData(blob, onSetBlobData)
                  }
                />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
