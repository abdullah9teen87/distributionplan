"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  HiSearch,
  HiUserAdd,
  HiViewGrid,
  HiViewList,
} from "react-icons/hi";
import SortableTable from "../SortableTable";
import Link from "next/link";
import DistributorCardList from "./DistributorCardList";
import TableSkeleton from "../TableSkeleton"; // ✅ import skeleton
import CardSkeleton from "../CardSkeleton";   // ✅ import card skeleton

const DistributorTable = () => {
  const [distributors, setDistributors] = useState([]);
  const [viewMode, setViewMode] = useState("table");

  const [loading, setLoading] = useState(true); // ✅ loading state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const PAGE_SIZE_OPTIONS = [5, 10, 25, 50];

  useEffect(() => {
    const fetchDistributors = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `/api/distributors?page=${page}&limit=${pageSize}`
        );
        const fetchedDistributors = res?.data?.data?.data;
        setDistributors(
          Array.isArray(fetchedDistributors) ? fetchedDistributors : []
        );
        setTotalPages(res.data.totalPages || 1);
      } catch (err) {
        console.error("Error fetching distributors", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDistributors();
  }, [page, pageSize]);

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages, page]);

  const columns = [
    { header: "Reg. No.", accessor: "registrationNumber" },
    { header: "Name", accessor: "name" },
    { header: "Age", accessor: "age" },
    { header: "Mobile", accessor: "contactNumber" },
    { header: "CNIC", accessor: "cnicNumber" },
    { header: "Address", accessor: "address" },
    { header: "Status", accessor: "status" },
    { header: "Detail", accessor: "detail" },
    { header: "Father/Husband Name", accessor: "fatherHusbandName" },
    { header: "Gender", accessor: "gender" },
    { header: "Verified", accessor: "isVerified" },
    { header: "Job Status", accessor: "jobStatus" },
    { header: "Referral Person", accessor: "referalPerson" },
    { header: "Registration Date", accessor: "registrationDate" },
    { header: "Created At", accessor: "createdAt" },
  ];

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setPage(1);
  };

  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Heading + Buttons */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Distributor Records
        </h1>
        <div className="flex items-center gap-3">
          <Link
            href="/distributor/registration"
            className="hidden sm:flex items-center space-x-2 bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 rounded shadow transition text-sm"
          >
            <HiUserAdd size={20} />
            <span>Add Distributor</span>
          </Link>
          <Link href="/distributor/registration" className="sm:hidden text-gray-600">
            <HiUserAdd size={24} />
          </Link>
          <Link
            href="/distributor/update"
            className="hidden sm:flex items-center space-x-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded shadow transition text-sm"
          >
            <HiSearch size={20} />
            <span>Search Distributor</span>
          </Link>
          <Link href="/distributor/update" className="sm:hidden text-gray-800">
            <HiSearch size={24} />
          </Link>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex items-center justify-end gap-3 mb-6">
        <button
          onClick={() => setViewMode("table")}
          className={`px-4 py-1.5 rounded text-sm font-medium border transition flex items-center gap-2 ${
            viewMode === "table"
              ? "bg-blue-400 text-white border-blue-500"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
          }`}
        >
          <HiViewList size={18} />
          Table View
        </button>
        <button
          onClick={() => setViewMode("card")}
          className={`px-4 py-1.5 rounded text-sm font-medium border transition flex items-center gap-2 ${
            viewMode === "card"
              ? "bg-blue-400 text-white border-blue-500"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
          }`}
        >
          <HiViewGrid size={18} />
          Card View
        </button>
      </div>

      {/* Table or Card */}
      <div className="overflow-x-auto shadow-lg rounded-lg border-2 border-gray-300 p-1">
        {loading ? (
          viewMode === "table" ? (
            <TableSkeleton columns={columns} rows={8} />
          ) : (
            <CardSkeleton count={6} />
          )
        ) : viewMode === "table" ? (
          <SortableTable columns={columns} data={distributors} />
        ) : (
          <DistributorCardList distributors={distributors} />
        )}
      </div>

      {/* Pagination */}
      <nav className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className={`w-24 px-3 py-1.5 rounded-md transition text-sm text-center ${
              page === 1
                ? "bg-gray-300 cursor-not-allowed text-gray-600"
                : "bg-blue-400 hover:bg-blue-500 text-white"
            }`}
          >
            Previous
          </button>
          <span className="text-gray-700 font-medium">
            Page <span className="font-bold">{isNaN(page) ? "1" : page}</span> of{" "}
            <span className="font-bold">{isNaN(totalPages) ? "1" : totalPages}</span>
          </span>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages || totalPages < 1}
            className={`w-24 px-3 py-1.5 rounded-md transition text-sm text-center ${
              page === totalPages || totalPages < 1
                ? "bg-gray-300 cursor-not-allowed text-gray-600"
                : "bg-blue-400 hover:bg-blue-500 text-white"
            }`}
          >
            Next
          </button>
        </div>
        <div className="flex items-center justify-center sm:justify-end gap-2">
          <label htmlFor="pageSize" className="text-gray-700 font-medium">
            Rows per page:
          </label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={handlePageSizeChange}
            className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </nav>
    </div>
  );
};

export default DistributorTable;
