"use client";

import { useState, useEffect } from "react";

import { UploadForm } from "@/app/components/form/UploadForm";
import { CV } from "@/app/components/table/types";
import { AnalysisTable } from "@/app/components/table/AnalysisTable";

export default function Home() {
  const [cvs, setCvs] = useState<CV[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCvsData = async () => {
    setLoading(true);

    const response = await fetch("/api/cvs", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const { data } = await response.json();

    setCvs(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCvsData();
  }, []);

  return (
    <div className="p-10 bg-indigo-50">
      <main className="flex items-center justify-center w-full h-full">
        <div className="flex flex-col gap-4 w-full">
          <UploadForm />
          <AnalysisTable cvs={cvs} onSetCvs={setCvs} loading={loading} />
        </div>
      </main>
    </div>
  );
}
