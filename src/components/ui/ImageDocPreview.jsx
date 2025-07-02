import React, { useState, useRef, useEffect } from "react";
import { downloadFile } from "utils/fileUtils";
import {
  AiOutlineDownload,
  AiOutlineZoomIn,
  AiOutlineZoomOut,
  AiOutlineClose,
  AiOutlineUndo,
} from "react-icons/ai";
import { Button } from "components/ui/button";
import { Dialog, DialogContent } from "src/@/components/ui/dialog.jsx";
import { Tooltip, TooltipProvider } from "src/@/components/ui/tooltip";
import { Card } from "components/ui/card";
import { imageFileType } from "app/utils/Types/General";

export default function ImageDocPreview({
  attachment,
  name,
  isOpen = false,
  setIsOpen = () => {},
}) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const imgElement = imgRef.current;
    if (!imgElement) return;

    const handleWheel = (e) => {
      e.preventDefault();
      setScale((prevScale) =>
        Math.min(Math.max(prevScale + e.deltaY * -0.002, 1), 5)
      );
    };

    imgElement.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      imgElement.removeEventListener("wheel", handleWheel);
    };
  }, [scale]);

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

  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.2, 5));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.2, 1));
  const resetZoom = () => setScale(1);

  const handleMouseDown = (e) => {
    setDragging(true);
    setPosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    const dx = e.clientX - position.x;
    const dy = e.clientY - position.y;
    imgRef.current.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`;
  };

  const handleMouseUp = () => setDragging(false);

  const downloadAttachment = (event) => {
    event.preventDefault();
    event.stopPropagation();
    downloadFile(attachment, name);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open && fileType !== "PDF") resetZoom();
      }}
    >
      <DialogContent className="w-full max-w-6xl min-h-[90%] h-[90vh] flex flex-col gap-2 p-4 bg-white rounded-lg">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-2">
          <h4 className="text-lg font-semibold">{name || "Attachment"}</h4>
          {/* <Button
            onClick={() => setIsOpen(false)}
            variant="ghost"
            size="icon"
            className="text-gray-600 hover:text-red-500"
          >
            <AiOutlineClose className="w-5 h-5" />
          </Button> */}
        </div>

        {/* Controls */}
        {imageFileType.includes(fileType) && (
          <div className="flex gap-x-3 justify-center p-2 bg-gray-100 rounded-lg shadow-sm">
            <TooltipProvider>
              <Tooltip content="Zoom In">
                <Button onClick={handleZoomIn} variant="ghost" size="sm">
                  <AiOutlineZoomIn className="w-5 h-5 text-blue-600" />
                </Button>
              </Tooltip>
              <Tooltip content="Zoom Out">
                <Button onClick={handleZoomOut} variant="ghost" size="sm">
                  <AiOutlineZoomOut className="w-5 h-5 text-blue-600" />
                </Button>
              </Tooltip>
              <Tooltip content="Reset Zoom">
                <Button onClick={resetZoom} variant="ghost" size="sm">
                  <AiOutlineUndo className="w-5 h-5 text-gray-600" />
                </Button>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}

        {/* File Display */}
        <div className="overflow-hidden flex-grow relative flex justify-center items-center bg-gray-200 p-4 ">
          {imageFileType.includes(fileType) ? (
            <img
              ref={imgRef}
              src={fileURL}
              alt={name || "Attachment"}
              className="max-h-[100%] max-w-[100%] object-contain w-auto"
              style={{
                transform: `scale(${scale})`,
                transition: "transform 0.2s ease-out",
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            />
          ) : (
            <iframe
              src={
                fileType === "PDF"
                  ? fileURL
                  : `https://docs.google.com/gview?url=${encodeURIComponent(
                      fileURL
                    )}&embedded=true`
              }
              className="w-full h-full border-none mt-1"
              title={name}
              style={{ minHeight: "75vh" }}
            />
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t pt-2">
          <Button onClick={downloadAttachment} variant="continue" size="sm">
            Download <AiOutlineDownload className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
