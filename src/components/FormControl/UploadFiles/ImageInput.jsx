import React, { useRef, useState } from "react";
import ImageDocPreview from "components/ui/ImageDocPreview";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { getFileNameFromURL } from "utils/downloadUtils";
import upload from "assets/images/upload.png";

import { errorClassName } from "components/FormControl";

const ImageInput = React.memo(
  ({
    label = "",
    value = null,
    error = null,
    onChange = () => {},
    touch = null,
    name = null,
  }) => {
    const [viewImage, setViewImage] = useState(false);
    // Store both the URL and original file/string value
    const [previewData, setPreviewData] = useState({
      url: null,
      originalValue: null,
      fileName: null,
    });

    // Update previewData whenever value changes
    React.useEffect(() => {
      if (value) {
        const isFileObject = value instanceof File;
        const url = isFileObject ? URL.createObjectURL(value) : value;
        const fileName = isFileObject ? value.name : getFileNameFromURL(value);

        setPreviewData({
          url,
          originalValue: value,
          fileName,
        });

        // Clean up object URL when component unmounts or value changes
        return () => {
          if (isFileObject && url) {
            URL.revokeObjectURL(url);
          }
        };
      } else {
        setPreviewData({
          url: null,
          originalValue: null,
          fileName: null,
        });
      }
    }, [value]);

    const ImageFileInputRef = useRef(null);

    const handleUpload = (e) => {
      e.preventDefault();
      e.stopPropagation();
      ImageFileInputRef.current.click();
    };

    const handlRemove = (e) => {
      e.preventDefault();
      e.stopPropagation();
      onChange(name, null);
    };

    const handleImageClick = (event) => {
      event.preventDefault();
      setViewImage(true);
    };

    return (
      <>
        <div className="relative flex flex-row items-center justify-start w-full h-full border-solid rounded-3xl">
          <div className="relative overflow-hidden w-[110px]">
            {previewData.url ? (
              <img
                src={previewData.url}
                alt="Preview"
                className="h-[100px] object-cover border-2 border-gray-400 rounded-full cursor-pointer"
                width={"100px"}
                onClick={handleImageClick}
              />
            ) : (
              <img
                src={upload}
                alt="Default"
                className="h-[100px] block mx-auto border-2 border-gray-400 rounded-full"
                width={"100px"}
              />
            )}
          </div>
          <div className="flex flex-col justify-start gap-2">
            <div className="flex flex-wrap flex-row gap-3">
              <input
                id="picture"
                ref={ImageFileInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  const selectedFile = e.target.files[0];
                  if (selectedFile) {
                    // Check file size
                    const maxSize = 1024 * 1024; // 1 MB in bytes
                    let imageError = null;
                    if (selectedFile.size > maxSize) {
                      // File size exceeds 1 MB, handle error
                      imageError = "Please upload a file smaller than 1 MB.";
                    }
                    // Pass the file object directly
                    onChange(
                      name,
                      selectedFile, // Pass the file object instead of Base64
                      imageError
                    );
                  }
                }}
              />
              {!value && (
                <Button variant="continue" onClick={handleUpload}>
                  {`${value ? "Update" : "Upload"} ${label}`}
                </Button>
              )}
              {value && (
                <Button variant="continue" onClick={handlRemove}>
                  {`Remove`}
                </Button>
              )}
            </div>
            <span className="text-neutral-800 text-xs font-normal">
              JPEG or PNG. Max size of 100KB
            </span>
            {error && touch && <span className={errorClassName}>{error}</span>}
          </div>
        </div>
        {viewImage && previewData.url && (
          <ImageDocPreview
            attachment={previewData.originalValue}
            name={previewData.fileName || "Image"}
            isOpen={viewImage}
            setIsOpen={setViewImage}
          />
        )}
      </>
    );
  }
);

export default ImageInput;
