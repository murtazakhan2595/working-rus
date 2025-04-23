import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import moment from "moment";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const downloadFiles = async (file, name) => {
  try {
    const response = await axios.get(file, {
      responseType: "blob",
    });

    const contentType = response.headers["content-type"];

    // Check if the content type indicates a PDF
    if (contentType === "application/pdf") {
      downloadFile(response.data, `${name}.pdf`);
    } else if (contentType.startsWith("image")) {
      downloadFile(response.data, `${name}.${getImageExtension(contentType)}`);
    } else {
      console.error("Unsupported file type.");
    }
  } catch (error) {
    console.error("Error fetching file:", error);
  }
};

export const getFileNameFromURL = (url) => {
  if (!url) return null;
  const parts = url.split("/");
  const name = parts[parts.length - 1];
  return name && typeof name === "string"
    ? name.replace(/_/g, " ")
    : "Attachment Document";
};

const downloadFile = (data, fileName) => {
  const url = window.URL.createObjectURL(data);
  // Create a temporary link element
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();

  // Clean up
  window.URL.revokeObjectURL(url);
};

const getImageExtension = (contentType) => {
  switch (contentType) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/gif":
      return "gif";
    // Add support for more image formats if needed
    default:
      return "jpg"; // Default to jpg if the format is not recognized
  }
};

export const exportRecordToExcel = (
  dataToExport,
  module = "Company Record",
  filename
) => {
  const ModuleName = `${module ?? "Company Record"}`;
  const fileName = filename
    ? `${filename}.xlsx`
    : `${ModuleName}_${moment().format("YYYY-MM-DD_HH-mm-ss")}.xlsx`;

  if (!dataToExport || dataToExport.length === 0) {
    alert("No data to export!");
    return;
  }

  // Convert JSON to worksheet
  const worksheet = XLSX.utils.json_to_sheet(dataToExport);

  // Auto-adjust column widths
  const columnWidths = Object.keys(dataToExport[0]).map((key) => {
    const maxLength = Math.max(
      key.length,
      ...dataToExport.map((row) =>
        row[key] ? String(row[key]).length : 0
      )
    );
    return { wch: maxLength + 2 }; // Adding 2 for padding
  });

  worksheet["!cols"] = columnWidths;

  // Create a workbook and append the worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, ModuleName);

  // Write the workbook to a buffer
  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  // Create blob and trigger download
  const dataBlob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(dataBlob, fileName);
};


export const exportRecordToCSV = (
  dataToExport,
  module = "Company Record",
  filename
) => {
  const ModuleName = `${module ?? "Company Record"}`;
  const fileName = filename
    ? `${filename}.csv`
    : `${ModuleName}_${moment().format("YYYY-MM-DD_HH-mm-ss")}.csv`;

  if (!dataToExport || dataToExport.length === 0) {
    alert("No data to export!");
    return;
  }

  // Extract headers
  const headers = Object.keys(dataToExport[0]);

  // Convert data to CSV format
  const csvRows = [
    headers.join(","), // Header row
    ...dataToExport.map((row) =>
      headers
        .map((field) => {
          const value = row[field] ?? "";
          const escaped = String(value).replace(/"/g, '""');
          return `"${escaped}"`; // Wrap in quotes and escape
        })
        .join(",")
    ),
  ];

  const csvString = csvRows.join("\n");

  // Create a blob and trigger download
  const csvBlob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  saveAs(csvBlob, fileName);
};



export const exportRecordToPDF = (
  dataToExport,
  module = "Company Record",
  filename
) => {
  const ModuleName = `${module ?? "Company Record"}`;
  const fileName = filename
    ? `${filename}.pdf`
    : `${ModuleName}_${moment().format("YYYY-MM-DD_HH-mm-ss")}.pdf`;

  if (!dataToExport || dataToExport.length === 0) {
    alert("No data to export!");
    return;
  }

  const doc = new jsPDF();

  // Get the column headers
  const headers = Object.keys(dataToExport[0]);

  // Convert data to rows for PDF
  const dataRows = dataToExport.map((row) =>
    headers.map((key) => (row[key] !== null && row[key] !== undefined ? row[key] : ""))
  );

  // Title
  doc.setFontSize(16);
  doc.text(ModuleName, 14, 15);

  // Add autoTable
  autoTable(doc, {
    startY: 20,
    head: [headers],
    body: dataRows,
    styles: {
      fontSize: 10,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [22, 160, 133],
      textColor: 255,
      halign: "center",
    },
    bodyStyles: {
      halign: "left",
    },
  });

  // Save PDF
  doc.save(fileName);
};

