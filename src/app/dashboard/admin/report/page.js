

"use client";

import { useState } from "react";
import UserReportTable from "@/components/download/UserReportTable";
import DistributorReportTable from "@/components/download/DistributorReportTable";
import GroupReportTable from "@/components/download/GroupReportTable";
import PaymentReportTable from "@/components/download/PaymentReportTable";
import SignerReportTable from "@/components/download/SignerReportTable";
import { downloadCSV, downloadPDF } from "@/utils/reportDownloader";
import axios from "axios";
import { BASE_URL } from "@/data/baseurl";
import { getColumnWidths } from "@/data/reportColumnWidht";

export default function ReportsPage() {
  const [reportType, setReportType] = useState("");
  const [fromDate, setFromDate] = useState(""); // "2025-01"
  const [toDate, setToDate] = useState(""); // "2025-08"
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const reportTypes = [
    { value: "user", label: "User" },
    { value: "distributor", label: "Distributor" },
    { value: "group", label: "Group" },
    { value: "payment", label: "Payment" },
    { value: "signer", label: "Signer" },
  ];



  const handleGenerateReport = async () => {
    if (!reportType || !fromDate || !toDate) return;
    setLoading(true);
    setData([]);

    try {
      const res = await axios.get(`${BASE_URL}/api/reports/${reportType}`, {
        params: { fromDate, toDate },
      });
      setData(res.data.data);
    } catch (err) {
      console.error("Report fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const renderTable = () => {
    switch (reportType) {
      case "user":
        return <UserReportTable data={data} />;
      case "distributor":
        return <DistributorReportTable data={data} />;
      case "group":
        return <GroupReportTable data={data} />;
      case "payment":
        return <PaymentReportTable data={data} />;
      case "signer":
        return <SignerReportTable data={data} />;
      default:
        return null;
    }
  };

  const getReportTitle = (type) => {
  switch (type) {
    case "user":
      return "User Report";
    case "distributor":
      return "Distributor Report";
    case "group":
      return "Group Report";
    case "payment":
      return "Payment Report";
    case "signer":
      return "Signer Report";
    default:
      return "Report";
  }
};









  return (
    <div className="w-full h-screen bg-gray-100 p-6 mx-auto">
      <h1 className="text-2xl font-bold mb-6">Reports</h1>

      <div className=" bg-white  shadow rounded-lg p-6 space-y-4">
        {/* Report Selection + Date Range in Grid */}
        <div className="grid md:grid-cols-4 grid-cols-2 gap-6">
          {/* Report Type */}
          <div>
            <label className="block font-medium mb-1">Select Report</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full border border-gray-400 rounded p-2.5"
            >
              <option value="">-- Choose Report --</option>
              {reportTypes.map((r) => (
                <option key={r.value} value={r.value} className="py-4">
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          {/* From Date */}
          <div>
            <label className="block font-medium mb-1">From</label>
            <input
              type="month"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full border border-gray-400 px-3 py-2 rounded"
            />
          </div>

          {/* To Date */}
          <div>
            <label className="block font-medium mb-1">To</label>
            <input
              type="month"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full border border-gray-400 px-3 py-2 rounded"
            />
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerateReport}
            disabled={loading}
            className={`mt-6 h-fit py-2.5 px-4 text-white rounded-lg shadow ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-700"
            }`}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                Loading...
              </span>
            ) : (
              "Generate Report"
            )}
          </button>
        </div>
      </div>

      {/* Report Table Preview */}
      {loading && (
        <div className="mt-6 text-center text-gray-600">Fetching report...</div>
      )}

      {!loading && data.length > 0 && (
        <div className="mt-6 space-y-4">
          {renderTable()}

          {/* Download Options */}
          <div className="w-full grid md:grid-cols-6 grid-cols-2 gap-4">
            <button
              onClick={() =>
                downloadCSV(
                  data,
                  `${reportType}-report.csv`,
                  `${getReportTitle(reportType)}`
                )
              }
              className="px-4 py-2 bg-blue-400 hover:bg-blue-600 text-white rounded-lg shadow"
            >
              Download CSV
            </button>
            <button
              onClick={() =>
                downloadPDF(
                  data,
                  `${reportType}-report.pdf`,
                  `${getReportTitle(reportType)}`,
                  getColumnWidths(reportType)
                )
              }
              className="px-4 py-2 bg-blue-400 hover:bg-blue-500 text-white rounded-lg shadow"
            >
              Download PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
