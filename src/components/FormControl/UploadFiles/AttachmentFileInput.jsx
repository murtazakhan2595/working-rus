import React, { useState } from "react";
import { AiOutlinePaperClip } from "react-icons/ai";
import { Button } from "components/ui/button";
import AttachmentUI from "components/ui/AttachmentUI";
import { RenderUploadedFiles } from "./index";

function AttachmentFileInput({
  files,
  acceptType,
  multiple,
  handleFile,
  handleRemoveFile = () => {},
  handleUpdateFileClick = () => {},
  allowUpdate = true,
  disabled = false,
  AccetpedFile = null,
  maxSize,
}) {
  const [dragActive, setDragActive] = useState(false);

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

  const handleUploadClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Create temporary file input (same pattern as handleUpdateFileClick)
    const tempFileInput = document.createElement("input");
    tempFileInput.type = "file";
    tempFileInput.accept = acceptType;
    tempFileInput.style.display = "none";

    // Add change event listener
    tempFileInput.addEventListener("change", (event) => {
      event.preventDefault();
      if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];
        handleFile(file);
      }
      // Clean up
      document.body.removeChild(tempFileInput);
    });

    // Add to body and trigger click
    document.body.appendChild(tempFileInput);
    tempFileInput.click();
  };

  const shouldShowUploadArea = multiple || files.length === 0;

  return (
    <>
      <RenderUploadedFiles
        files={files}
        allowUpdate={allowUpdate}
        viewOnly={disabled}
        removeFile={handleRemoveFile}
        handleUpdateFileClick={handleUpdateFileClick}
      />
      {shouldShowUploadArea && (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border border-neutral-500 rounded-lg p-3 ${
            dragActive ? "border-purple-500 bg-purple-50" : "border-gray-300"
          }`}
        >
          <div className="flex items-center mb-2 justify-between">
            <div className="flex items-center gap-2">
              <AiOutlinePaperClip />
              <div className="text-gray-900">
                <span className="text-plum-1100 font-inter font-semibold">
                  Upload a file
                </span>
                <span className="font-inter"> or drag and drop</span>
                <div className="text-sm font-inter">
                  {AccetpedFile} up to {maxSize}MB
                </div>
              </div>
            </div>
            <Button
              variant="continue"
              onClick={handleUploadClick}
              disabled={disabled}
              size={"sm"}
            >
              Upload
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

export default AttachmentFileInput;
