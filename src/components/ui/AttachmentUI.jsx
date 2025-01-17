import React from "react";
import { downloadFile } from "utils/fileUtils";
import { AiOutlineDownload } from "react-icons/ai";
import { MdClose } from "react-icons/md";
import {
  Dialog,
  // DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  // DialogDescription,
  DialogFooter,
  // DialogCancel,
  // DialogAction,
} from "src/@/components/ui/dialog.jsx";
const imageFileType=["JPG", "JPEG", "PNG", "GIF","WEBP"];
export default function AttachmentUI({
  attachment,
  name,
  removeFile,
  key,
  id = null,
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
console.log(fileType)
  return (
    <div key={key || ""}>
      <div className="flex items-center justify-between w-full gap-2 p-4 my-1 border border-gray-400 rounded-lg">
        <div className="flex items-center w-[85%]">
          <div
            className="flex items-center justify-center w-9 h-9"
            style={{ minWidth: "2rem" }}
          >
            {/* File preview based on type */}
            {imageFileType.includes(fileType) ? (
              <img
                src={
                  attachment instanceof File
                    ? URL.createObjectURL(attachment)
                    : attachment
                }
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
              onClick={() => setViewAttachment(true)} // Wrap in an arrow function
              className="hover:text-gray-700"
              // onLoad={(e) => {
              //   if (attachment instanceof File) {
              //     URL.revokeObjectURL(e.target.src);
              //   }
              // }}
            >
              {name || "Attachment"}
            </span>
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
              onClick={() => removeFile(attachment, id)}
            />
          )}
        </div>
      </div>
      {viewAttachment && (
        <Dialog open={viewAttachment} onOpenChange={setViewAttachment}>
          <DialogContent>
            <DialogHeader>
               <DialogTitle className={'text-sm'}>{name}</DialogTitle>
             </DialogHeader>
            <div style={{ marginBottom: "10px" }}>
              {imageFileType.includes(fileType) ? (
                <img
                  src={
                    attachment instanceof File
                      ? URL.createObjectURL(attachment)
                      : attachment
                  }
                  alt={name || "Attachment"}
                  style={{
                    width: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <iframe
                  src={
                    attachment instanceof File
                      ? URL.createObjectURL(attachment)
                      : attachment
                  }
                  style={{
                    width: "100%",
                    height: "200px",
                    border: "none",
                  }}
                  title="PDF Preview"
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
