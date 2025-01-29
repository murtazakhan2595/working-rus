import React from "react";
import { downloadFile } from "utils/fileUtils";
import { AiOutlineDownload } from "react-icons/ai";
import { Button } from "components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "src/@/components/ui/dialog.jsx";
import { imageFileType } from "app/utils/Types/General";
export default function AttachmentUI({
  attachment,
  name,
  removeFile,
  key,
  handleUpdateFileClick,
  id = null,
  displayImageAttachment = true,
}) {
  const [viewAttachment, setViewAttachment] = React.useState(false);

  if (!attachment) return null;

  // Extract file type for rendering
  const getFileType = (file) => {
    let fileType;

    if (file instanceof File) {
      fileType = file.name.split(".").pop()?.toUpperCase();
    } else {
      fileType = file?.split(".").pop()?.toUpperCase();
    }

    return fileType && fileType.length > 4 ? fileType.slice(0, 4) : fileType;
  };

  const fileType = getFileType(attachment);
  const fileURL =
    attachment instanceof File ? URL.createObjectURL(attachment) : attachment;

  if (!displayImageAttachment && imageFileType.includes(fileType)) return null;
  return (
    <div key={key || ""}>
      <div
        className={`flex items-center justify-between w-full gap-2 p-4 my-1 border border-gray-400 rounded-lg`}
      >
        <div className="flex items-center w-[85%]">
          <div
            className="flex items-center justify-center w-9 h-9"
            style={{ minWidth: "2rem" }}
          >
            {/* File preview based on type */}
            {imageFileType.includes(fileType) ? (
              <img
                src={fileURL}
                alt={name || "Attachment"}
                className="w-9 h-9"
                onLoad={(e) => {
                  // Revoke object URL after load
                  if (attachment instanceof File) {
                    URL.revokeObjectURL(e.target.src);
                  }
                }}
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
              }} // Wrap in an arrow function
              className="hover:text-gray-700"
            >
              {name || "Attachment"}
            </span>
          </span>
        </div>
        {/* <div className="flex items-center gap-x-2">
          <div
            onClick={() => downloadFile(attachment, name)}
            className="text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            <AiOutlineDownload className="w-5 h-5" />
          </div>
          {removeFile && (
            <MdClose
              className="w-5 h-5 text-gray-500 cursor-pointer"
              onClick={() => removeFile(attachment, id)}
            />
          )}
        </div> */}
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
        <Dialog open={viewAttachment} onOpenChange={setViewAttachment}>
          <DialogContent className="max-w-[80vw] w-[80vw] h-[80vh]">
            <DialogHeader>
              <DialogTitle className={"text-sm"}>
                <div className="flex justify-between">
                  <span> {name}</span>
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      downloadFile(attachment, name);
                    }}
                    className="mr-3"
                    variant="outline"
                    size={"sm"}
                  >
                    Download <AiOutlineDownload className="w-5 h-5" />
                  </Button>{" "}
                </div>
              </DialogTitle>
            </DialogHeader>
            <div className="max-h-[100%] overflow-hidden mb-2">
              {imageFileType.includes(fileType) ? (
                <img
                  src={fileURL}
                  alt={name || "Attachment"}
                  style={{
                    width: "auto",
                    objectFit: "cover",
                    // maxWidth:'100%',
                    margin:'auto',
                    maxHeight:'100%'
                  }}
                />
              ) : (
                <iframe
                  src={
                    fileType === "pdf"
                      ? fileURL
                      : `https://docs.google.com/gview?url=${encodeURIComponent(
                          fileURL
                        )}&embedded=true`
                  }
                  style={{
                    width: "100%",
                    height: "auto",
                    maxHeight: "80vh",
                    border: "none",
                  }}
                  title={name}
                  onLoad={(e) => {
                    if (attachment instanceof File) {
                      URL.revokeObjectURL(e.target.src); // Clean up object URL
                    }
                  }}
                />
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
