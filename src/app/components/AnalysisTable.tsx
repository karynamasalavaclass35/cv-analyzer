import _ from "lodash";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ExtendedPutBlobResult } from "../types";

type Props = {
  blobStorageData: ExtendedPutBlobResult[];
};

export function AnalysisTable({ blobStorageData }: Props) {
  return (
    <Table className="w-full">
      <TableHeader>
        <TableRow>
          {Object.keys(blobStorageData[0].analysis).map((column) => (
            <TableHead key={column} className="w-1/4">
              {_.startCase(column)}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody className="max-w-full">
        {blobStorageData.map((blob) => {
          const analysis = blob.analysis;
          const values = Object.values(analysis);
          return (
            <TableRow key={blob.pathname}>
              {values.map((value: any, index: number) => (
                <TableCell key={index} className="w-1/4">
                  {Array.isArray(value) ? (
                    <ol className="list-decimal list-inside">
                      {value.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ol>
                  ) : (
                    value
                  )}
                </TableCell>
              ))}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
