// "use client";
// import { useMemo, useState } from "react";

// const SortableTable = ({ columns, data }) => {
//   const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

//   const sortedData = useMemo(() => {
//     if (!sortConfig.key) return data;
//     return [...data].sort((a, b) => {
//       const aVal = a[sortConfig.key];
//       const bVal = b[sortConfig.key];
//       if (aVal === null || aVal === undefined) return 1;
//       if (bVal === null || bVal === undefined) return -1;
//       const aStr = aVal.toString().toLowerCase();
//       const bStr = bVal.toString().toLowerCase();
//       if (aStr < bStr) return sortConfig.direction === "asc" ? -1 : 1;
//       if (aStr > bStr) return sortConfig.direction === "asc" ? 1 : -1;
//       return 0;
//     });
//   }, [data, sortConfig]);

//   const requestSort = (key) => {
//     setSortConfig((prev) => ({
//       key,
//       direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
//     }));
//   };

//   const getIndicator = (key) =>
//     sortConfig.key === key
//       ? sortConfig.direction === "asc"
//         ? " ▲"
//         : " ▼"
//       : "";

//   return (
//     <table className="w-full border-collapse border-gray-300 border table-auto">
//       <thead>
//         <tr>
//           {columns.map(({ header, accessor, sortable = true }) => (
//             <th
//               key={accessor}
//               onClick={sortable ? () => requestSort(accessor) : undefined}
//               className={`p-2 border border-gray-300 ${
//                 sortable ? "cursor-pointer" : "cursor-default"
//               } 
//                 text-[9px] sm:text-[8px] md:text-[10px] lg:text-[12px]
//                 whitespace-nowrap truncate capitalize`}
//               style={{ maxWidth: 150 }}
//             >
//               {header}
//               {getIndicator(accessor)}
//             </th>
//           ))}
//         </tr>
//       </thead>
//       <tbody>
//         {sortedData.map((row, idx) => (
//           <tr key={idx} className="even:bg-gray-100">
//             {columns.map(({ accessor }) => (
//               <td
//                 key={accessor}
//                 className="p-2 border border-gray-300
//                 text-[9px] sm:text-[8px] md:text-[10px] lg:text-[12px]
//                 whitespace-nowrap truncate capitalize"
//                 style={{ maxWidth: 150 }}
//               >
//                 {row[accessor]?.toString() || ""}
//               </td>
//             ))}
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );
// };

// export default SortableTable;


"use client";
import { useMemo, useState } from "react";

const SortableTable = ({ columns, data }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;
    return [...data].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;
      const aStr = aVal.toString().toLowerCase();
      const bStr = bVal.toString().toLowerCase();
      if (aStr < bStr) return sortConfig.direction === "asc" ? -1 : 1;
      if (aStr > bStr) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  const requestSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const getIndicator = (key) =>
    sortConfig.key === key
      ? sortConfig.direction === "asc"
        ? " ▲"
        : " ▼"
      : "";

  return (
    <table className="w-full border-collapse border border-gray-300 table-auto rounded-md overflow-hidden">
      <thead className="bg-gray-50 shadow-sm">
        <tr>
          {columns.map(({ header, accessor, sortable = true }) => (
            <th
              key={accessor}
              onClick={sortable ? () => requestSort(accessor) : undefined}
              className={`p-3 border border-gray-300 text-gray-700 ${
                sortable ? "cursor-pointer hover:bg-gray-100" : "cursor-default"
              }
                text-[10px] sm:text-[12px] md:text-sm lg:text-base
                whitespace-nowrap truncate capitalize select-none
                transition-colors duration-200 ease-in-out`}
              style={{ maxWidth: 180 }}
              title={header}
            >
              {header}
              {getIndicator(accessor)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sortedData.length === 0 ? (
          <tr>
            <td
              colSpan={columns.length}
              className="p-4 text-center text-gray-500 italic"
            >
              No data available
            </td>
          </tr>
        ) : (
          sortedData.map((row, idx) => (
            <tr
              key={idx}
              className="even:bg-gray-50 hover:bg-blue-50 transition-colors duration-150 cursor-pointer"
              title={`View details for ${row.name ?? "user"}`}
            >
              {columns.map(({ accessor }) => (
                <td
                  key={accessor}
                  className="p-3 border border-gray-300 text-gray-600
                    text-[9px] sm:text-[10px] md:text-[12px] lg:text-sm
                    whitespace-nowrap truncate capitalize"
                  style={{ maxWidth: 180 }}
                  title={row[accessor]?.toString() ?? ""}
                >
                  {row[accessor]?.toString() ?? ""}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

export default SortableTable;
