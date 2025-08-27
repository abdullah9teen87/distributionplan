// "use client";
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   HiCash,
//   HiSearch,
//   HiPlusCircle,
//   HiViewGrid,
//   HiViewList,
// } from "react-icons/hi";
// import SortableTable from "./SortableTable"; // reuseable sortable table
// import Link from "next/link";
// import PaymentCardList from "./PaymentCardList"; // card view for payments
// import { BASE_URL } from "@/data/baseurl";

// const AllPayment = () => {
//   const [payments, setPayments] = useState([]);
//   const [viewMode, setViewMode] = useState("table"); // "table" | "card"

//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [pageSize, setPageSize] = useState(10);
//   const PAGE_SIZE_OPTIONS = [5, 10, 25, 50];

// useEffect(() => {
//   const fetchPayments = async () => {
//     try {
//       const res = await axios.get(`${BASE_URL}/api/payments`);
//       console.log("Fetched payments:", res?.data?.data?.data);
//       setPayments(res?.data?.data?.data || []);
//     } catch (err) {
//       if (err.response?.status === 404) {
//         // No payments case
//         setPayments([]);
//       } else {
//         console.error("Error fetching payments", err);
//       }
//     }
//   };

//   fetchPayments();
// }, []);


//   useEffect(() => {
//     if (page > totalPages) {
//       setPage(1);
//     }
//   }, [totalPages, page]);

//   // Columns for table view
//   const columns = [
//     { header: "Distributor", accessor: "distributor.name" },
//     { header: "Month", accessor: "month" },
//     { header: "Total Amount", accessor: "totalAmount" },
//     { header: "Returned Amount", accessor: "returnedAmount" },
//     { header: "Status", accessor: "status" },
//     { header: "Closed By Admin", accessor: "isClosedByAdmin" },
//     { header: "Remarks", accessor: "remarks" },
//     { header: "Created At", accessor: "createdAt" },
//   ];

//   const handlePageSizeChange = (e) => {
//     setPageSize(Number(e.target.value));
//     setPage(1);
//   };

//   return (
//     <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       {/* Heading + Buttons */}
//       <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
//         <h1 className="text-2xl font-semibold text-gray-800">
//           Distributor Payments
//         </h1>

//         <div className="flex items-center gap-3">
//           {/* Add Payment Button */}
//           <Link
//             href="/payments/newpayment"
//             className="hidden sm:flex items-center space-x-2 bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 rounded shadow transition text-sm"
//           >
//             <HiPlusCircle size={20} />
//             <span>New Payment</span>
//           </Link>
//           <Link href="/payments/newpayment" className="sm:hidden text-gray-600">
//             <HiPlusCircle size={24} />
//           </Link>

//           {/* Search Payment Button */}
//           <Link
//             href="/payments/search"
//             className="hidden sm:flex items-center space-x-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded shadow transition text-sm"
//           >
//             <HiSearch size={20} />
//             <span>Search Payment</span>
//           </Link>
//           <Link href="/payments/search" className="sm:hidden text-gray-800">
//             <HiSearch size={24} />
//           </Link>
//         </div>
//       </div>

//       {/* Toggle View */}
//       <div className="flex items-center justify-end gap-3 mb-6">
//         <button
//           onClick={() => setViewMode("table")}
//           className={`px-4 py-1.5 rounded text-sm font-medium border transition flex items-center gap-2 ${
//             viewMode === "table"
//               ? "bg-blue-400 text-white border-blue-500"
//               : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
//           }`}
//         >
//           <HiViewList size={18} />
//           Table View
//         </button>

//         <button
//           onClick={() => setViewMode("card")}
//           className={`px-4 py-1.5 rounded text-sm font-medium border transition flex items-center gap-2 ${
//             viewMode === "card"
//               ? "bg-blue-400 text-white border-blue-500"
//               : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
//           }`}
//         >
//           <HiViewGrid size={18} />
//           Card View
//         </button>
//       </div>

//       {/* Table or Card View */}
//       <div className="overflow-x-auto shadow-lg rounded-lg border-2 border-gray-300 p-1">
//         {viewMode === "table" ? (
//           <SortableTable columns={columns} data={payments} />
//         ) : (
//           <PaymentCardList payments={payments} />
//         )}
//       </div>

//       {/* Pagination */}
//       <nav className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
//         <div className="flex items-center gap-3">
//           <button
//             onClick={() => setPage((p) => Math.max(p - 1, 1))}
//             disabled={page === 1}
//             className={`w-24 px-3 py-1.5 rounded-md transition text-sm text-center ${
//               page === 1
//                 ? "bg-gray-300 cursor-not-allowed text-gray-600"
//                 : "bg-blue-400 hover:bg-blue-500 text-white"
//             }`}
//           >
//             Previous
//           </button>

//           <span className="text-gray-700 font-medium">
//             Page <span className="font-bold">{isNaN(page) ? "1" : page}</span>{" "}
//             of <span className="font-bold">{isNaN(totalPages) ? "1" : totalPages}</span>
//           </span>

//           <button
//             onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
//             disabled={page === totalPages || totalPages < 1}
//             className={`w-24 px-3 py-1.5 rounded-md transition text-sm text-center ${
//               page === totalPages || totalPages < 1
//                 ? "bg-gray-300 cursor-not-allowed text-gray-600"
//                 : "bg-blue-400 hover:bg-blue-500 text-white"
//             }`}
//           >
//             Next
//           </button>
//         </div>

//         {/* Rows per page */}
//         <div className="flex items-center justify-center sm:justify-end gap-2">
//           <label htmlFor="pageSize" className="text-gray-700 font-medium">
//             Rows per page:
//           </label>
//           <select
//             id="pageSize"
//             value={pageSize}
//             onChange={handlePageSizeChange}
//             className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
//           >
//             {PAGE_SIZE_OPTIONS.map((size) => (
//               <option key={size} value={size}>
//                 {size}
//               </option>
//             ))}
//           </select>
//         </div>
//       </nav>
//     </div>
//   );
// };

// export default AllPayment;


"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  HiSearch,
  HiPlusCircle,
  HiViewGrid,
  HiViewList,
} from "react-icons/hi";
import SortableTable from "./SortableTable"; 
import Link from "next/link";
import PaymentCardList from "./PaymentCardList"; 
import { BASE_URL } from "@/data/baseurl";
import TableSkeleton from "./TableSkeleton";   // ✅ skeleton import
import CardSkeleton from "./CardSkeleton";     // ✅ card skeleton import

const AllPayment = () => {
  const [payments, setPayments] = useState([]);
  const [viewMode, setViewMode] = useState("table");
  const [loading, setLoading] = useState(true);   // ✅ loading state

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const PAGE_SIZE_OPTIONS = [5, 10, 25, 50];

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true); // ✅ start loader
      try {
        const res = await axios.get(`${BASE_URL}/api/payments?page=${page}&limit=${pageSize}`);
        setPayments(res?.data?.data?.data || []);
        setTotalPages(res?.data?.totalPages || 1);
      } catch (err) {
        if (err.response?.status === 404) {
          setPayments([]);
        } else {
          console.error("Error fetching payments", err);
        }
      } finally {
        setLoading(false); // ✅ stop loader
      }
    };

    fetchPayments();
  }, [page, pageSize]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(1);
    }
  }, [totalPages, page]);

  const columns = [
    { header: "Distributor", accessor: "distributor.name" },
    { header: "Month", accessor: "month" },
    { header: "Total Amount", accessor: "totalAmount" },
    { header: "Returned Amount", accessor: "returnedAmount" },
    { header: "Status", accessor: "status" },
    { header: "Closed By Admin", accessor: "isClosedByAdmin" },
    { header: "Remarks", accessor: "remarks" },
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
          Distributor Payments
        </h1>

        <div className="flex items-center gap-3">
          <Link
            href="/payments/newpayment"
            className="hidden sm:flex items-center space-x-2 bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 rounded shadow transition text-sm"
          >
            <HiPlusCircle size={20} />
            <span>New Payment</span>
          </Link>
          <Link href="/payments/newpayment" className="sm:hidden text-gray-600">
            <HiPlusCircle size={24} />
          </Link>

          <Link
            href="/payments/search"
            className="hidden sm:flex items-center space-x-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded shadow transition text-sm"
          >
            <HiSearch size={20} />
            <span>Search Payment</span>
          </Link>
          <Link href="/payments/search" className="sm:hidden text-gray-800">
            <HiSearch size={24} />
          </Link>
        </div>
      </div>

      {/* Toggle View */}
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

      {/* Table or Card View */}
      <div className="overflow-x-auto shadow-lg rounded-lg border-2 border-gray-300 p-1">
        {loading ? (
          viewMode === "table" ? (
            <TableSkeleton columns={columns} rows={8} />
          ) : (
            <CardSkeleton count={6} />
          )
        ) : viewMode === "table" ? (
          <SortableTable columns={columns} data={payments} />
        ) : (
          <PaymentCardList payments={payments} />
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
            Page <span className="font-bold">{isNaN(page) ? "1" : page}</span>{" "}
            of <span className="font-bold">{isNaN(totalPages) ? "1" : totalPages}</span>
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

        {/* Rows per page */}
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

export default AllPayment;
