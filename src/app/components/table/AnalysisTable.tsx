import _ from "lodash";
import { Eye, Trash2 } from "lucide-react";

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
import { Analysis, CV, Role } from "@/app/components/table/types";

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
    <Table className="mt-20">
      <TableHeader>
        <TableRow className="text-indigo-900 w-full">
          {columns.map((column) => (
            <TableHead key={column} className="text-indigo-800">
              {_.startCase(column)}
            </TableHead>
          ))}
          <TableHead key="head_actions" className="text-indigo-800 w-10" />
        </TableRow>
      </TableHeader>

      <TableBody>
        {cvs.map((cv) => {
          const { id, roles } = cv;

          if (!roles?.length) {
            return (
              <TableRow key={id} className="w-full">
                <ApplicantCell cv={cv} />
                <TableRowContent />
                <DeleteCell />
              </TableRow>
            );
          }

          return roles.map((role, index) => (
            <TableRow key={`${id}-${role.id}`} className="w-full">
              {index === 0 && <ApplicantCell cv={cv} rowSpan={roles.length} />}
              <TableRowContent role={role} />
              <DeleteCell />
            </TableRow>
          ));
        })}
      </TableBody>
    </Table>
  );
}

const ApplicantCell = ({ cv, rowSpan }: { cv: CV; rowSpan?: number }) => (
  <TableCell
    className="border-r"
    {...(rowSpan && rowSpan > 1 ? { rowSpan } : {})}
  >
    <div className="flex items-center gap-2">
      {cv.fileName}
      <Eye
        size={16}
        className="text-indigo-700 hover:opacity-70 cursor-pointer"
        onClick={() => window.open(cv.url, "_blank")}
      />
    </div>
  </TableCell>
);

const DeleteCell = () => (
  <TableCell className="text-center">
    <Trash2
      size={16}
      className="cursor-pointer text-indigo-900 hover:text-red-800"
      // todo: add delete functionality: does it delete both from the blob and db?
      // onClick={async () => await deleteCVAnalysisData(cv.id, onSetCvs)}
    />
  </TableCell>
);

const TableRowContent = ({ role }: { role?: Role }) => (
  <>
    <TableCell>{role?.name ?? "-"}</TableCell>
    <TableCell>{role?.description ?? "-"}</TableCell>
    <TableCell>{role?.fitScore ? `${role.fitScore}%` : "-"}</TableCell>
  </>
);
