"use client";
import React from "react";

const TableSkeleton = ({ columns = [], rows = 5 }) => {
  return (
    <table className="w-full border-collapse border border-gray-200 table-auto rounded-md overflow-hidden">
      <thead className="bg-gray-50 shadow-sm">
        <tr>
          {columns.map((col, idx) => (
            <th
              key={idx}
              className="p-3 border border-gray-200 text-gray-700 text-[10px] sm:text-[12px] md:text-sm lg:text-base font-medium capitalize"
            >
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }).map((_, rowIdx) => (
          <tr key={rowIdx} className="even:bg-gray-50">
            {columns.map((_, colIdx) => (
              <td
                key={colIdx}
                className="p-3 border border-gray-200"
              >
                <div className="h-3 w-[80%] bg-gray-200 animate-pulse rounded"></div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TableSkeleton;
