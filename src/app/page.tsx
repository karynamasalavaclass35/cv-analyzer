"use client";

import { useState, useEffect } from "react";

import { AnalysisTable } from "@/app/components/AnalysisTable";
import { NoResults } from "@/app/components/NoResults";
import { UploadForm } from "@/app/components/UploadForm";
import { ExtendedPutBlobResult } from "@/app/types";
import { getBlobData } from "@/utils/requests";

export default function Home() {
  const [blobData, setBlobData] = useState<ExtendedPutBlobResult[]>([]);

  const fetchBlobData = async () => {
    const { data } = await getBlobData();
    setBlobData(data);
  };

  useEffect(() => {
    fetchBlobData();
  }, []);

  return (
    <div className="p-10 bg-indigo-50">
      <main className="flex items-center justify-center w-full h-full">
        <div className="flex flex-col gap-4 w-full">
          <UploadForm blobData={blobData} onFetchBlobData={fetchBlobData} />

          <div className="mt-20">
            {blobData.length > 0 ? (
              <AnalysisTable
                blobStorageData={blobData}
                onSetBlobData={setBlobData}
              />
            ) : (
              <NoResults />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
