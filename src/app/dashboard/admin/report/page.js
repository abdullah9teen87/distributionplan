"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { BASE_URL } from "@/data/baseurl";

export default function ReportsPage() {
  const [reportType, setReportType] = useState("user");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [fileType, setFileType] = useState("csv"); // csv or pdf
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [loading, setLoading] = useState(false);

  const reportTypes = [
    { value: "user", label: "User" },
    { value: "distributor", label: "Distributor" },
    { value: "group", label: "Group" },
    { value: "payment", label: "Payment" },
    { value: "signer", label: "Signer" },
  ];

  // Define columns per report type
  const reportColumns = {
    user: ["name", "email", "role", "status", "createdAt"],
    distributor: ["name", "email", "region", "status", "createdAt"],
    group: ["groupName", "membersCount", "createdAt"],
    payment: ["transactionId", "user", "amount", "status", "date"],
    signer: ["name", "email", "role", "isAdminApprove", "createdAt"],
  };

  useEffect(() => {
    // reset selected columns on report type change
    setSelectedColumns(reportColumns[reportType] || []);
  }, [reportType]);

  const toggleColumn = (col) => {
    setSelectedColumns((prev) =>
      prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col]
    );
  };

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
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Reports</h1>

      <div className="bg-white shadow rounded-lg p-6 space-y-4">
        {/* Report Type */}
        <div>
          <label className="block font-medium mb-1">Report Type</label>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            {reportTypes.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>

        {/* Date Range */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block font-medium mb-1">From</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div className="flex-1">
            <label className="block font-medium mb-1">To</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
        </div>

        {/* File Type */}
        <div>
          <label className="block font-medium mb-1">File Type</label>
          <select
            value={fileType}
            onChange={(e) => setFileType(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="csv">CSV</option>
            <option value="pdf">PDF</option>
          </select>
        </div>

        {/* Column Selection */}
        <div>
          <label className="block font-medium mb-1">Select Columns</label>
          <div className="flex flex-wrap gap-2">
            {reportColumns[reportType].map((col) => (
              <button
                key={col}
                onClick={() => toggleColumn(col)}
                className={`px-3 py-1 rounded border ${
                  selectedColumns.includes(col)
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-white text-gray-700 border-gray-300"
                }`}
              >
                {col}
              </button>
            ))}
          </div>
        </div>

        {/* Download Button */}
        <div>
          <button
            onClick={downloadReport}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
          >
            {loading ? "Downloading..." : "Download Report"}
          </button>
        </div>
      </div>
    </div>
  );
}
