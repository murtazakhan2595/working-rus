import React from "react";
import { downloadFile } from "utils/fileUtils";
import { AiOutlineDownload } from "react-icons/ai";
import { MdClose } from "react-icons/md";

export default function AttachmentUI({ attachment, name, removeFile }) {
  if (!attachment) return null;

  // Extract file type for rendering
  const getFileType = (file) => {
    if (file instanceof File) {
      return file.name.split(".").pop()?.toLowerCase();
    }
    return file?.split(".").pop()?.toLowerCase();
  };

  const fileType = getFileType(attachment);

  return (
    <div className="flex items-center justify-between w-full gap-2 p-4 my-1 border border-gray-400 rounded-lg">
      <div className="flex items-center">
        <div
          className="flex items-center justify-center w-8 h-8"
          style={{ minWidth: "2rem" }}
        >
          {/* File preview based on type */}
          {["jpg", "jpeg", "png", "gif"].includes(fileType) ? (
            <img
              src={
                attachment instanceof File
                  ? URL.createObjectURL(attachment)
                  : attachment
              }
              alt={name || "Attachment"}
              className="w-8 h-8"
              onLoad={(e) => {
                // Revoke object URL after load
                if (attachment instanceof File) {
                  URL.revokeObjectURL(e.target.src);
                }
              }}
            />
          ) : (
            <span className="text-xs font-semibold text-gray-700 bg-gray-300 rounded-lg w-full h-full flex items-center justify-center">
              {fileType?.toUpperCase() || "FILE"}
            </span>
          )}
        </div>
        <span className="ml-4 text-sm text-baseGray">
          <a
            href={
              attachment instanceof File
                ? URL.createObjectURL(attachment)
                : attachment
            }
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-700"
          >
            {name || "Attachment"}
          </a>
        </span>
      </div>
      <div className="flex items-center gap-x-2">
        <div
          onClick={() => downloadFile(attachment, name)}
          className="text-gray-500 hover:text-gray-700 cursor-pointer"
        >
          <AiOutlineDownload className="w-5 h-5" />
        </div>
        {removeFile && (
          <MdClose
            className="w-5 h-5 text-gray-500 cursor-pointer"
            onClick={() => removeFile(attachment)}
          />
        )}
      </div>
    </div>
  );
}

