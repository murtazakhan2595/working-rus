import axios from "axios";

export const downloadAttachment = async (file, name) => {
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

export const downloadFile = (attachment, fileName) => {
  if (!attachment) return null;
  if (attachment instanceof File) {
    const blobURL = URL.createObjectURL(attachment);
    const link = document.createElement("a");
    link.href = blobURL;
    link.download = fileName || attachment.name || "download";
    link.click();
    URL.revokeObjectURL(blobURL);
  } else {
    filebase64Download(attachment, fileName);
  }
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

export function filebase64Download(file, fileName) {
  // Open the file in a new tab
  const newTab = window.open(file, "_blank");

  if (!newTab) {
    console.error(
      "Failed to open the file in a new tab. Please check browser settings."
    );
  }
}

export function getFileSizeInKB(base64String) {
  if (!base64String) return "";
  const base64Data = base64String.split(",")[1];
  const binaryString = atob(base64Data);
  const byteLength = binaryString.length;
  const kbSize = byteLength / 1024;
  return kbSize.toFixed(0);
}

export function convert_base64_To_File(base64URL) {
  if (base64URL) {
    // Extract base64 string
    const base64Data = base64URL.replace(/^data:image\/png;base64,/, "");

    // Convert base64 to a Blob
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "image/png" });

    // Create a File object
    const file = new File([blob], "signature.png", { type: "image/png" });

    return file;
  }
}
