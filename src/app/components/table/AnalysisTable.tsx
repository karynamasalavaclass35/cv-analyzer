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
import { Analysis, ExtendedPutBlobResult } from "@/app/types";
import { deleteCVAnalysisData } from "@/utils/blobRequests";
import { NoResults } from "@/app/components/table/NoResults";
import { Loading } from "@/app/components/table/Loading";

type Props = {
  blobStorageData: ExtendedPutBlobResult[];
  onSetBlobData: (blobData: ExtendedPutBlobResult[]) => void;
  loading: boolean;
};

const columns: (keyof Analysis)[] = [
  "fileName",
  "pros",
  "cons",
  "fitPercentage",
  "feedback",
];

export function AnalysisTable({
  blobStorageData,
  onSetBlobData,
  loading,
}: Props) {
  if (loading) return <Loading />;
  if (!blobStorageData.length) return <NoResults />;

  return (
    <Table>
      <TableHeader>
        <TableRow className="text-indigo-900 w-full">
          {columns.map((column) => (
            <TableHead key={column} className="text-indigo-800">
              {_.startCase(column)}
            </TableHead>
          ))}
          <TableHead key="head_actions" className="text-indigo-800" />
        </TableRow>
      </TableHeader>

      <TableBody>
        {blobStorageData.map((blob) => {
          const { analysis, pathname } = blob;
          return (
            <TableRow key={pathname} className="w-full">
              {columns.map((column) => (
                <TableCell key={column}>
                  {Array.isArray(analysis[column]) ? (
                    analysis[column].length > 0 ? (
                      <ol className="list-decimal list-inside">
                        {analysis[column].map((item) => {
                          if (typeof item !== "string") return "N/A";
                          return <li key={item}>{item}</li>;
                        })}
                      </ol>
                    ) : (
                      "N/A"
                    )
                  ) : (
                    analysis[column] ?? "N/A"
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
