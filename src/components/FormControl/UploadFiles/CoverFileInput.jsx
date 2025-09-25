import React, { useState, useRef } from "react";
import { FileUp } from "lucide-react";
import AttachmentUI from "components/ui/AttachmentUI";
import { RenderUploadedFiles } from "./index";
export const CoverFileInput = ({
  files,
  acceptType,
  multiple,
  handleFile,
  handleRemoveFile = () => { },
  handleUpdateFileClick = () => { },
  disabled = false,
  allowUpdate = true,
  AccetpedFile,
  maxSize,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFile(file);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      handleFile(file);
    }
  };

  const renderInputFile = () => {
    return (
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 ${dragActive ? "border-primary-500 bg-primary-50" : "border-neutral-300"}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center min-h-[200px] text-center">
          <div className="mb-4">
            <FileUp className="w-16 h-16 text-neutral-400" />
          </div>
          <p className="mb-2">
            <span className="font-semibold text-primary">Upload a file</span>
            <span className="text-neutral-1000"> or drag and drop</span>
          </p>
          <p className="text-sm text-neutral-1000">
            {AccetpedFile} up to {maxSize}MB
          </p>

          <input
            ref={fileInputRef}
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleChange}
            accept={acceptType}
            title=""
          />
        </div>
      </div>
    );
  };

  return files && files.length > 0 ? (
    <div className="space-y-3">
      <RenderUploadedFiles
        files={files}
        allowUpdate={allowUpdate}
        viewOnly={disabled}
        removeFile={handleRemoveFile}
        handleUpdateFileClick={handleUpdateFileClick}
      />
      {multiple && renderInputFile()}
    </div>
  ) : (
    renderInputFile()
  );
};
