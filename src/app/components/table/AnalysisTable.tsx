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
import { CV, Role } from "@/app/components/table/types";
import { deleteCvFromBlob } from "@/utils/blobRequests";
import { deleteCv } from "@/utils/cvRequests";
import { toast } from "@/components/ui/sonner";

type Props = {
  cvs: CV[];
  onSetCvs: (cvs: CV[]) => void;
  loading: boolean;
};

const columns = ["applicant", "role", "requirements", "fitScore"];

export function AnalysisTable({ cvs, onSetCvs, loading }: Props) {
  if (loading) return <Loading />;
  if (!cvs.length) return <NoResults />;

  const handleDelete = async (cv: CV, roleId?: string) => {
    // todo: loading state?
    if (roleId) {
      // TODO: delete role from cv
      toast.success("The role was successfully deleted");
    } else {
      await deleteCvFromBlob(cv);
      const newCvs = await deleteCv(cv.id);
      toast.success("The CV was successfully deleted");
      onSetCvs(newCvs);
    }
  };

  return (
    <Table>
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
                <DeleteCell onDelete={() => handleDelete(cv)} />
              </TableRow>
            );
          }

          return roles.map((role, index) => (
            <TableRow key={`${id}-${role.id}`} className="w-full">
              {index === 0 && <ApplicantCell cv={cv} rowSpan={roles.length} />}
              <TableRowContent role={role} />
              <DeleteCell onDelete={() => handleDelete(cv, role.id)} />
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

const DeleteCell = ({ onDelete }: { onDelete: () => Promise<void> }) => (
  <TableCell className="text-center">
    <Trash2
      size={16}
      className="cursor-pointer text-indigo-900 hover:text-red-800"
      onClick={async () => await onDelete()}
    />
  </TableCell>
);

const TableRowContent = ({ role }: { role?: Role }) => (
  <>
    <TableCell>{role?.name ?? "-"}</TableCell>
    <TableCell>
      <div className="max-h-24 overflow-y-auto">{role?.description ?? "-"}</div>
    </TableCell>
    <TableCell>{role?.fitScore ? `${role.fitScore}%` : "-"}</TableCell>
  </>
);
