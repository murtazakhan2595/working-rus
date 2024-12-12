import axios from "axios";

export const downloadAttachment = async (file, name) => {
  console.log("downloading", file, name);
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

const downloadFile = (data, fileName) => {
  const link = document.createElement("a");
  link.href = data;
  window.open(data, "_blank");

  // Revoke the object URL to free up memory
  window.URL.revokeObjectURL(data);
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

export function filebase64Download(file,fileName) {
  const link = document.createElement("a");
  link.href = file;
  link.download = fileName || "downloaded-file";
  link.click();
}
export function getFileSizeInKB(base64String) {
  if (!base64String) return "";
  const base64Data = base64String.split(",")[1];
  const binaryString = atob(base64Data);
  const byteLength = binaryString.length;
  const kbSize = byteLength / 1024;
  return kbSize.toFixed(0);
}
