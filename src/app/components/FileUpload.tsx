"use client";

import { useEffect, useState } from "react";

import { getBlobData } from "@/app/components/helpers";
import { ExtendedPutBlobResult } from "@/app/types";
import { AnalysisTable } from "@/app/components/AnalysisTable";
import { UploadForm } from "@/app/components/UploadForm";
import { NoResults } from "@/app/components/NoResults";

export default function FileUpload() {
  const [blobData, setBlobData] = useState<ExtendedPutBlobResult[]>([]);

  const fetchBlobData = async () => {
    const { data } = await getBlobData();
    setBlobData(data);
  };

  useEffect(() => {
    fetchBlobData();

    const intervalId = setInterval(() => {
      fetchBlobData();
    }, 15000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex flex-col gap-4 w-full">
      <UploadForm blobData={blobData} />

      <div className="mt-20">
        {blobData.length > 0 ? (
          <AnalysisTable blobStorageData={blobData} />
        ) : (
          <NoResults />
        )}
      </div>
    </div>
  );
}
