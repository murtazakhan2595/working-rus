import React, { useState, useEffect, useRef } from "react";
import { Label } from "src/@/components/ui/label";
import { getFileNameFromURL } from "utils/downUtils";
import {
  FileUp,
} from "lucide-react";
import {errorClassName} from 'app/utils/Types/General'

export const CoverFileUpload = ({
    name,
    value,
    error,
    touch,
    onChange,
    label,
    acceptType,
    required,
    maxSize = 10,
  }) => {
    const [dragActive, setDragActive] = useState(false);
    const [files, setFiles] = useState([]); // Store multiple files
    const fileInputRef = useRef(null);
  
    // Initialize files from value
    useEffect(() => {
      if (value) {
        // If the value is a URL, set the file data with the URL
        if (typeof value === "string" && value.startsWith("http")) {
          setFiles([{ name: getFileNameFromURL(value), url: value }]);
        } else {
          setFiles(Array.isArray(value) ? value : [value]);
        }
      }
    }, [value]);
  
    const handleDrag = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === "dragenter" || e.type === "dragover") {
        setDragActive(true);
      } else if (e.type === "dragleave") {
        setDragActive(false);
      }
    };
  
    const validateFile = (file) => {
      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        return false;
      }
      return true;
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
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        handleFile(file);
      }
    };
  
    const handleFile = (file) => {
      if (validateFile(file)) {
        const reader = new FileReader();
        reader.onload = () => {
          const fileData = {
            name: file.name,
            file: reader.result,
          };
  
          // Replace existing files with new file
          setFiles([file]);
          onChange(name, file); // Send single file to parent
        };
        reader.readAsDataURL(file);
      }
    };
  
    const handleRemoveFile = (indexToRemove) => {
      const updatedFiles = files.filter((_, index) => index !== indexToRemove);
      setFiles(updatedFiles);
      onChange(name, updatedFiles.length ? updatedFiles : null);
    };
  
    const formatFileSize = (bytes) => {
      if (bytes === 0) return "0 Bytes";
      const k = 1024;
      const sizes = ["Bytes", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + sizes[i];
    };
  
    const handleNewFileClick = () => {
      // Create a temporary file input
      const tempFileInput = document.createElement("input");
      tempFileInput.type = "file";
      tempFileInput.accept = acceptType;
      tempFileInput.style.display = "none";
  
      // Add change event listener
      tempFileInput.addEventListener("change", (e) => {
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
                  fileData.url
                    ? fileData.url
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
              {/* ) : (
                <p className="text-sm text-neutral-500">
                  {formatFileSize(fileData?.file?.length)}
                </p>
              )} */}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handleNewFileClick}
              className="text-sm font-medium text-primary hover:text-plum-700"
            >
              Update
            </button>
            <button
              type="button"
              onClick={() => handleRemoveFile(index)}
              className="text-sm font-medium text-neutral-900 hover:text-neutral-700"
            >
              Remove
            </button>
          </div>
        </div>
      ));
    };
  
    return (
      <div className="flex flex-col gap-4 mb-4">
        <Label className="text-normal " htmlFor={name}>
          {required && <span className="text-red-600">* </span>}
          {label || "Attachments"}
        </Label>
  
        {value ? (
          <div className="space-y-3">{renderUploadedFiles(value)}</div>
        ) : (
          <div
            className={`relative border-2 border-dashed rounded-lg p-6 ${
              dragActive
                ? "border-primary-500 bg-primary-50"
                : "border-neutral-300"
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
        )}
  
        {error && touch && <div className={errorClassName}>{error}</div>}
      </div>
    );
  };