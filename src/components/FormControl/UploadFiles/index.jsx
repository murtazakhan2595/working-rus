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
  allowUpdate = true,
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

  const handleFile = (file, attachmentId = null) => {
    if (validateFile(file)) {
      const reader = new FileReader();
      reader.onload = () => {  
        setFiles((prevFiles) => {
          debugger
          let updatedFiles;
          if (attachmentId) {
            // Replace existing file with the same attachmentId
            updatedFiles = prevFiles.map((existingFile) =>
              existingFile.id === attachmentId ? file : existingFile
            );
          } else {
            // Add new file
            updatedFiles = [...prevFiles, file];
          }
          // Send updated file list to parent
          onChange(name, multiple ? updatedFiles : file);
          return updatedFiles;
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveFile = (attachment, id) => {
    const updatedFiles = files.filter((file) => file.attachment !== attachment);
    setFiles(updatedFiles);
    onChange(name, updatedFiles.length && multiple ? updatedFiles : null);
    if (id) {
      deleteAttachment(id);
    }
  };

  const handleUpdateFileClick = (event, attachmentId) => {
    event.preventDefault();
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
        handleFile(file, attachmentId);
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
          allowUpdate={allowUpdate}
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
          allowUpdate={allowUpdate}
        />
      )}
      {error && touch && <div className={errorClassName}>{error}</div>}
    </div>
  );
};
export default CoverFileUpload;
