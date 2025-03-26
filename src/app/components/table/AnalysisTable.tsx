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
import { NoResults } from "@/app/components/table/NoResults";
import { Loading } from "@/app/components/table/Loading";
import { Analysis, CV } from "@/app/components/table/types";

type Props = {
  cvs: CV[];
  onSetCvs: (cvs: CV[]) => void;
  loading: boolean;
};

const columns: (keyof Analysis)[] = [
  "applicant",
  "role",
  "requirements",
  "fitScore",
];

export function AnalysisTable({ cvs, onSetCvs, loading }: Props) {
  if (loading) return <Loading />;
  if (!cvs.length) return <NoResults />;

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
        {cvs.map((cv) => {
          const { id, fileName, roles } = cv;

          return (
            roles?.length > 0 &&
            roles.map((role) => (
              <TableRow key={`${id}-${role.id}`} className="w-full">
                <TableCell>{fileName}</TableCell>
                <TableCell>{role.name}</TableCell>
                <TableCell>{role.description}</TableCell>
                <TableCell>{`${role.fitScore}%`}</TableCell>
                <TableCell className="text-center">
                  <Trash2
                    size={16}
                    className="cursor-pointer text-indigo-900 hover:text-red-800"
                    // onClick={async () => await deleteCVAnalysisData(cv.id, onSetCvs)}
                  />
                </TableCell>
              </TableRow>
            ))
          );
        })}
      </TableBody>
    </Table>
  );
}
