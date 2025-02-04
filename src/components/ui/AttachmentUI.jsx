import React, { useState, useRef, useEffect } from "react";
import { imageFileType } from "app/utils/Types/General";
import ImageDocPreview  from "components/ui/ImageDocPreview";

export default function AttachmentUI({
  attachment,
  name,
  removeFile,
  key,
  handleUpdateFileClick,
  id = null,
  displayImageAttachment = true,
}) {
  const [viewAttachment, setViewAttachment] = useState(false);
  if (!attachment) return null;

  const getFileType = (file) => {
    let fileType =
      file instanceof File
        ? file.name.split(".").pop()?.toUpperCase()
        : file?.split(".").pop()?.toUpperCase();
    return fileType && fileType.length > 4 ? fileType.slice(0, 4) : fileType;
  };

  const fileType = getFileType(attachment);
  const fileURL =
    attachment instanceof File ? URL.createObjectURL(attachment) : attachment;

  if (!displayImageAttachment && imageFileType.includes(fileType)) return null;

  return (
    <div key={key || ""}>
      <div className="flex items-center justify-between w-full gap-2 p-4 my-1 border border-gray-400 rounded-lg">
        <div className="flex items-center w-[85%]">
          <div
            className="flex items-center justify-center w-9 h-9"
            style={{ minWidth: "2rem" }}
          >
            {imageFileType.includes(fileType) ? (
              <img
                src={fileURL}
                alt={name || "Attachment"}
                className="w-9 h-9"
              />
            ) : (
              <span className="text-xs font-semibold text-gray-800 bg-gray-300 rounded-lg w-full h-full flex items-center justify-center">
                {fileType || "FILE"}
              </span>
            )}
          </div>
          <span className="ml-4 text-sm text-baseGray overflow-hidden cursor-pointer">
            <span
              onClick={(e) => {
                e.preventDefault();
                setViewAttachment(true);
              }}
              className="hover:text-gray-700"
            >
              {name || "Attachment"}
            </span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          {handleUpdateFileClick && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                handleUpdateFileClick();
              }}
              className="text-sm font-medium text-primary hover:text-plum-700"
            >
              Update
            </button>
          )}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              removeFile(attachment, id);
            }}
            className="text-sm font-medium text-neutral-900 hover:text-neutral-700"
          >
            Remove
          </button>
        </div>
      </div>

      {viewAttachment && (
        <ImageDocPreview
          attachment={attachment}
          name={name}
          isOpen={viewAttachment}
          setIsOpen={setViewAttachment}
        />
      )}
    </div>
  );
}
