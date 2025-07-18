import React, { useState, useEffect } from "react";
import { getFileNameFromURL } from "utils/downloadUtils";
import { FormField } from "components/FormControl";
import { CoverFileInput } from "./CoverFileInput";
import AttachmentFileInput from "./AttachmentFileInput";
import AttachmentUI from "components/ui/AttachmentUI";

const CoverFileUpload = ({
  name,
  value,
  error,
  touch,
  onChange = () => {},
  label,
  acceptType,
  required,
  maxSize = 10,
  variant = "CoverFileUpload", // [AttachmentFileUpload, CoverFileUpload] other options
  multiple = false,
  deleteAttachment = () => {},
  allowUpdate = true,
  className = "w-full", // Custom styling
  disabled = false,
  description,
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

  const AccetpedFile = React.useMemo(() => {
    if (!acceptType) return "PNG, JPG, GIF, CSV, DOC, PDF"; // default accepted file types

    // Convert ".pdf,.xlsx" to "PDF, XLSX"
    return acceptType
      .split(",")
      .map((ext) => ext.replace(".", "").toUpperCase())
      .join(", ");
  }, [acceptType]);

  return (
    <FormField
      name={name}
      label={label}
      required={required}
      error={error}
      touched={touch}
      className={className}
      field_description={description}
    >
      {variant === "CoverFileUpload" && (
        <CoverFileInput
          files={files}
          acceptType={acceptType}
          maxSize={maxSize}
          handleFile={handleFile}
          multiple={multiple}
          handleRemoveFile={handleRemoveFile}
          handleUpdateFileClick={handleUpdateFileClick}
          allowUpdate={allowUpdate}
          disabled={disabled}
          AccetpedFile={AccetpedFile}
        />
      )}
      {variant === "AttachmentFileUpload" && (
        <AttachmentFileInput
          files={files}
          acceptType={acceptType}
          handleFile={handleFile}
          multiple={multiple}
          maxSize={maxSize}
          handleRemoveFile={handleRemoveFile}
          handleUpdateFileClick={handleUpdateFileClick}
          allowUpdate={allowUpdate}
          disabled={disabled}
          AccetpedFile={AccetpedFile}
        />
      )}
    </FormField>
  );
};

export const RenderUploadedFiles = ({
  files,
  viewOnly = false,
  allowUpdate = true,
  handleUpdateFileClick = () => {},
  removeFile = () => {},
}) => {
  if (!files) return null;
  return files.map((fileData, index) => (
    <>
      <AttachmentUI
        attachment={fileData.attachment || fileData}
        name={fileData.name}
        removeFile={removeFile}
        handleUpdateFileClick={handleUpdateFileClick}
        id={fileData.id}
        key={index}
        allowUpdate={allowUpdate}
        viewOnly={viewOnly}
      />
    </>
  ));
};
export default CoverFileUpload;
