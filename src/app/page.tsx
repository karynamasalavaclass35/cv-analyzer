"use client";

import { useState, useEffect } from "react";

import { AnalysisTable } from "@/app/components/table/AnalysisTable";
import { UploadForm } from "@/app/components/form/UploadForm";
import { ExtendedPutBlobResult } from "@/app/types";
import { getBlobData } from "@/utils/blobRequests";

export default function Home() {
  const [blobData, setBlobData] = useState<ExtendedPutBlobResult[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchBlobData = async () => {
    setLoading(true);
    const { data } = await getBlobData();
    setBlobData(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchBlobData();
  }, []);

  return (
    <div className="p-10 bg-indigo-50">
      <main className="flex items-center justify-center w-full h-full">
        <div className="flex flex-col gap-4 w-full">
          <UploadForm blobData={blobData} onFetchBlobData={fetchBlobData} />
          {/* 
          <div className="mt-20">
            <AnalysisTable
              blobStorageData={blobData}
              onSetBlobData={setBlobData}
              loading={loading}
            />
          </div> */}
        </div>
      </main>
    </div>
  );
}
