import React, { useState, useRef } from "react";
import { AiOutlinePaperClip } from "react-icons/ai";
import { Button } from "components/ui/button";
import AttachmentUI from "components/ui/AttachmentUI";

function AttachmentFileInput({
  files,
  acceptType,
  multiple,
  handleFile,
  handleRemoveFile = () => {},
  handleUpdateFileClick = () => {},
  allowUpdate=true,
}) {
  const [dragActive, setDragActive] = useState(false);
  const AttachmentFileInputRef = useRef(null);
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
      <AttachmentUI
        attachment={fileData.attachment}
        name={fileData.name}
        removeFile={handleRemoveFile}
        handleUpdateFileClick={handleUpdateFileClick}
        id={fileData.id}
        key={index}
        allowUpdate={allowUpdate}
      />
    ));
  };

  return multiple ? (
    <>
      {renderUploadedFiles()}
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
              <div className="text-sm font-inter">PNG, JPG, GIF up to 10MB</div>
            </div>
          </div>
          <Button
            variant="continue"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              AttachmentFileInputRef.current.click();
            }}
            size={"sm"}
          >
            Upload
          </Button>
          <input
            ref={AttachmentFileInputRef}
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer hidden"
            onChange={handleChange}
            accept={acceptType}
            title=""
          />
        </div>
      </div>
    </>
  ) : (
    renderUploadedFiles()
  );
}

export default AttachmentFileInput;
