import { unparse } from "papaparse";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
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


// export const downloadPDF = (data, filename, title = "Report", columnWidths = {}) => {
//   if (!data || data.length === 0) return;

//   const doc = new jsPDF();

//   // Title & Date
//   const now = new Date();
//   const reportDate = now.toLocaleString();
//   doc.setFontSize(16);
//   doc.text(`${title}`, 14, 15);
//   doc.setFontSize(10);
//   doc.text(`Generated: ${reportDate}`, 14, 22);

//   const columns = Object.keys(data[0]);
//   const rows = data.map((row) => columns.map((col) => row[col]));

//   autoTable(doc, {
//     startY: 30,
//     head: [columns],
//     body: rows,
//     styles: { fontSize: 10 },
//     columnStyles: columns.reduce((acc, col, idx) => {
//       if (columnWidths[col]) acc[idx] = { cellWidth: columnWidths[col] };
//       return acc;
//     }, {}),
//   });

//   doc.save(filename);
// };




export const downloadPDF = (data, filename, title = "Report", columnWidths = {}, orientation = "landscape") => {
  if (!data || data.length === 0) return;

  const doc = new jsPDF({ orientation });

  // Title & Date
  const now = new Date();
  const reportDate = now.toLocaleString();
  doc.setFontSize(12);
  doc.text(title, 10, 13);
  doc.setFontSize(8);
  doc.text(`Generated: ${reportDate}`, 10, 18);

  // Use only the columns defined in columnWidths
  const columns = Object.keys(columnWidths);
  const rows = data.map((row) =>
    columns.map((col) => row[col] ?? "") // take only defined columns
  );

  autoTable(doc, {
    startY: 30,
    head: [columns],
    body: rows,
    styles: { fontSize: 10 },
    columnStyles: columns.reduce((acc, col, idx) => {
      if (columnWidths[col]) acc[idx] = { cellWidth: columnWidths[col] };
      return acc;
    }, {}),
  });

  doc.save(filename);
};
