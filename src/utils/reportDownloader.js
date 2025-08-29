import { unparse } from "papaparse";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { getColumnMapping } from "@/data/getColumnMapping";
// import { jsPDF } from "jspdf";
// import autoTable from "jspdf-autotable";

export const downloadCSV = (data, filename, title = "Report") => {
  if (!data || data.length === 0) return;

  const reportDate = new Date().toLocaleString();

  // Columns
  const columns = Object.keys(data[0]);

  // Rows
  const rows = data.map((row) => columns.map((col) => row[col]));

  // Title row + date
  const csvData = [
    [title], // Title
    [`Report Date: ${reportDate}`], // Date
    [], // empty row
    columns, // header row
    ...rows, // actual data rows
  ];

  const csv = unparse(csvData);

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
};

export const downloadPDF = (
  data,
  filename,
  title = "Report", 
  columnWidths = {},
  orientation = "landscape",
  reportType
) => {
  if (!data || data.length === 0) return;

  const doc = new jsPDF({ orientation });

  const logo = "/DistributionPlan.png"; // public folder me rakho
  doc.addImage(logo, "PNG", 5, 5, 10, 10);


  // Title & Date
  const now = new Date();
  const reportDate = now.toLocaleString();

  doc.setFontSize(12);
  doc.text(title, doc.internal.pageSize.getWidth() / 2, 12, {
    align: "center",
  });

  doc.setFontSize(8);
  doc.text(
    `Generated: ${reportDate}`,
    doc.internal.pageSize.getWidth() / 2,
    17,
    { align: "center" }
  );

  // Only defined columns
  const columns = Object.keys(columnWidths);
  const columnMap = getColumnMapping(reportType);

  const rows = data.map((row) =>
    columns.map((label) => {
      const key = columnMap[label];
      return row[key] ?? "";
    })
  );

  autoTable(doc, {
    startY: 25,
    head: [columns],
    body: rows,
    tableWidth: "wrap",
    margin: { left: 10, right: 10 },
    tableWidth: "wrap",

    styles: {
      fontSize: 7,
      cellPadding: 2,
      lineWidth: 0.1,
      lineColor: [0, 0, 0],
      textColor: [0, 0, 0],
      fillColor: [255, 255, 255],
    },

    headStyles: {
      fontSize: 7,
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0],
      lineWidth: 0.2,
      lineColor: [0, 0, 0],
      fontStyle: "bold",
       halign: "center",
      valign: "middle",
    },

    // ✅ Fix: give safe default width if not defined
    columnStyles: columns.reduce((acc, col, idx) => {
      const width = columnWidths[col];
      acc[idx] = {
        cellWidth: typeof width === "number" && !isNaN(width) ? width : "auto",
      };
      return acc;
    }, {}),
  });

  doc.save(filename);
};
