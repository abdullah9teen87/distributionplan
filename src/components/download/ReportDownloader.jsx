"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { BASE_URL } from "@/data/baseurl";

export default function ReportDownloader({ reportType, fromDate, toDate, selectedColumns, fileType }) {
  const [loading, setLoading] = useState(false);

  const downloadReport = async () => {
    if (!fromDate || !toDate) {
      toast.error("Please select both start and end dates.");
      return;
    }

    if (!selectedColumns.length) {
      toast.error("Please select at least one column.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/reports/${reportType}`, {
        responseType: "blob",
        params: {
          from: fromDate,
          to: toDate,
          columns: selectedColumns.join(","),
          fileType,
        },
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `${reportType}-report-${fromDate}-to-${toDate}.${fileType}`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("Report downloaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to download report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={downloadReport}
      disabled={loading}
      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
    >
      {loading ? "Downloading..." : `Download ${fileType.toUpperCase()}`}
    </button>
  );
}
