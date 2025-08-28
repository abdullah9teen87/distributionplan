import axios from "axios";

const downloadCSV = async () => {
  const res = await axios.get("/api/reports/user", {
    responseType: "blob", // Important
    params: { fileType: "csv" },
  });

  const url = window.URL.createObjectURL(new Blob([res.data], { type: "text/csv" }));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "report.csv"); // File name
  document.body.appendChild(link);
  link.click();
  link.remove();
};
