import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import moment from "moment";

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

  if (dataToExport.length === 0) {
    alert("No data to export!");
    return;
  }

  // Convert JSON to worksheet
  const worksheet = XLSX.utils.json_to_sheet(dataToExport);

  // Create a workbook and append worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, ModuleName);

  // Write workbook and trigger download
  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const dataBlob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(dataBlob, fileName);
};
