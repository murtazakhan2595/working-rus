import React, { useState, useRef, useEffect } from "react";
import { downloadFile } from "utils/fileUtils";
import {
  AiOutlineDownload,
  AiOutlineZoomIn,
  AiOutlineZoomOut,
} from "react-icons/ai";
import { Button } from "components/ui/button";
import { Dialog, DialogContent } from "src/@/components/ui/dialog.jsx";
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

    const wheelListener = (e) => handleWheel(e);

    imgElement.addEventListener("wheel", wheelListener, { passive: false });

    return () => {
      imgElement.removeEventListener("wheel", wheelListener);
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

  const handleWheel = (e) => {
    e.preventDefault();
    setScale((prevScale) =>
      Math.min(Math.max(prevScale + e.deltaY * -0.002, 1), 5)
    );
  };

  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.2, 5));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.2, 1));

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

  const handleMouseUp = () => {
    setDragging(false);
  };

  const resetZoom = () => {
    setScale(1);
    imgRef.current.style.transform = "translate(0px, 0px) scale(1)";
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) resetZoom();
      }}
    >
      <DialogContent className="w-[90vw] min-w-[90vw] min-h-[90%] h-[90vh] flex flex-col gap-1 pb-2">
        <div className="flex flex-row w-full max-w-full overflow-hidden justify-between">
          <h6>{name || "Attachment"}</h6>
          <div className="flex gap-x-2 justify-center">
            <Button
              onClick={handleZoomIn}
              variant="ghost"
              size="sm"
              className="py-0"
            >
              <AiOutlineZoomIn className="w-5 h-5" />
            </Button>
            <Button
              onClick={handleZoomOut}
              variant="ghost"
              size="sm"
              className="py-0"
            >
              <AiOutlineZoomOut className="w-5 h-5" />
            </Button>
          </div>
          <Button
            onClick={() => downloadFile(attachment, name)}
            className="mr-3"
            variant="continue"
            size="sm"
          >
            Download <AiOutlineDownload className="w-5 h-5" />
          </Button>
        </div>
        <div className="overflow-hidden flex-grow relative flex justify-center items-center h-[calc(100%_-_90px)] ">
          {imageFileType.includes(fileType) ? (
            <img
              ref={imgRef}
              src={fileURL}
              alt={name || "Attachment"}
              className="max-h-[100%] max-w-[100%] object-contain w-auto"
              style={{
                transform: `scale(${scale})`,
                transition: "transform 0.2s ease-out",
                cursor: `${scale === 1 ? "zoom-in" : "grab"}`,
              }}
              onWheel={handleWheel}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
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
              className="w-full h-[80vh] border-none"
              title={name}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
