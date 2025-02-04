import React, { useState, useEffect, useRef } from "react";
import { Label } from "src/@/components/ui/label";
import { getFileNameFromURL } from "utils/downUtils";
import { FileUp } from "lucide-react";
import { errorClassName } from "app/utils/Types/General";
import { CoverFileInput } from "./CoverFileInput";
import AttachmentFileInput from "./AttachmentFileInput";

const CoverFileUpload = ({
  name,
  value,
  error,
  touch,
  onChange,
  label,
  acceptType,
  required,
  showLabel = true,
  maxSize = 10,
  variant = "CoverFileUpload",
  multiple = true,
  deleteAttachment = () => {},
}) => {
  const [files, setFiles] = useState([]); // Store multiple files
  // Initialize files from value
  useEffect(() => {
    if (value) {
      if (typeof value === "string") {
        // If value is a URL, return an array with a single JSON object
        setFiles([{ attachment: value, name: getFileNameFromURL(value) }]);
      } else if (Array.isArray(value)) {
        // If value is already an array of JSON objects, use it as-is
        setFiles(value);
      } else {
        // If value is a single object, wrap it in an array
        setFiles([value]);
      }
    } else {
      setFiles([]);
    }
  }, [value]);

  const validateFile = (file) => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      return false;
    }
    return true;
  };

  const handleFile = (file) => {
    if (validateFile(file)) {
      const reader = new FileReader();
      reader.onload = () => {
        debugger;
        const updatedFiles = [...files, file];
        // Replace existing files with new file
        setFiles(updatedFiles);
        onChange(name, multiple ? updatedFiles : file); // Send single file to parent if mutiple is false
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveFile = (attachment, id) => {
    console.log(files);
    debugger;
    const updatedFiles = files.filter((file) => file.attachment !== attachment);
    setFiles(updatedFiles);
    onChange(name, updatedFiles.length && multiple ? updatedFiles : null);
    if(id){
      deleteAttachment(id);
    }
  };

  const handleUpdateFileClick = () => {
    // Create a temporary file input
    const tempFileInput = document.createElement("input");
    tempFileInput.type = "file";
    tempFileInput.accept = acceptType;
    tempFileInput.style.display = "none";

    // Add change event listener
    tempFileInput.addEventListener("change", (e) => {
      e.preventDefault();
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        handleFile(file);
      }
      // Remove the temporary input after use
      document.body.removeChild(tempFileInput);
    });

    // Add to body and trigger click
    document.body.appendChild(tempFileInput);
    tempFileInput.click();
  };

  return (
    <div className={`flex flex-col gap-4 mb-4`}>
      {showLabel && (
        <Label className="text-normal " htmlFor={name}>
          {required && <span className="text-red-600">* </span>}
          {label || "Attachments"}
        </Label>
      )}
      {variant === "CoverFileUpload" && (
        <CoverFileInput
          files={files}
          acceptType={acceptType}
          handleFile={handleFile}
          multiple={multiple}
          handleRemoveFile={handleRemoveFile}
          handleUpdateFileClick={handleUpdateFileClick}
        />
      )}
      {variant === "AttachmentFileUpload" && (
        <AttachmentFileInput
          files={files}
          acceptType={acceptType}
          handleFile={handleFile}
          multiple={multiple}
          handleRemoveFile={handleRemoveFile}
          handleUpdateFileClick={handleUpdateFileClick}
        />
      )}
      {error && touch && <div className={errorClassName}>{error}</div>}
    </div>
  );
};
export default CoverFileUpload;
