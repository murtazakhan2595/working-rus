import React, { useState, useRef } from "react";
import { FileUp } from "lucide-react";

export const CoverFileInput = ({
  files,
  acceptType,
  multiple,
  handleFile,
  handleRemoveFile,
  handleUpdateFileClick = () => {},
  disabled=false,
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

  const renderUploadedFiles = () => {
    return files.map((fileData, index) => (
      <div
        key={index}
        className="flex items-center justify-between p-4 bg-white border rounded-lg border-neutral-500"
      >
        <div
          className="flex items-center gap-3"
          style={{ maxWidth: "67%", overflow: "hidden" }}
        >
          <div className="text-neutral-500">
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-900">
              {fileData.name}
            </p>
            <a
              href={
                fileData.attachment
                  ? fileData.attachment
                  : fileData
                  ? URL.createObjectURL(fileData)
                  : "#"
              }
              download
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-neutral-700"
            >
              View Document
            </a>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleUpdateFileClick}
            className="text-sm font-medium text-primary hover:text-plum-700"
            disabled={disabled}
          >
            Update
          </button>
          <button
            type="button"
            onClick={() => handleRemoveFile(index)}
            className="text-sm font-medium text-neutral-900 hover:text-neutral-700"
            disabled={disabled}
          >
            Remove
          </button>
        </div>
      </div>
    ));
  };
  const renderInputFile = () => {
    return (
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 ${
          dragActive ? "border-primary-500 bg-primary-50" : "border-neutral-300"
        }`}
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
            {acceptType === ".pdf"
              ? "Please upload PNG, JPG or PDF up to 10MB"
              : "PNG, JPG or PDF up to 10MB"}
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
      {renderUploadedFiles()} {multiple && renderInputFile()}
    </div>
  ) : (
    renderInputFile()
  );
};
