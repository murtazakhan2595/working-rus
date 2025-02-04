import React, { useRef, useCallback } from "react";
import { Label } from "src/@/components/ui/label";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";

import upload from "assets/images/upload.png";

import { errorClassName } from "app/utils/Types/General";

const ImageInput = React.memo(
  ({
    label = "",
    value = null,
    error = null,
    onChange = () => {},
    touch = null,
    name = null,
  }) => {
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
    return (
      <>
        <div className="relative flex flex-row items-center justify-start w-full h-full border-solid rounded-3xl">
          <div className="relative overflow-hidden w-[110px]">
            {value ? (
              <img
                src={
                  typeof value === "string"
                    ? value // If value is a URL, use it directly
                    : URL.createObjectURL(value) // If value is a file object, create a temporary URL
                }
                alt="Preview"
                className="h-[100px] object-cover border-2 border-gray-400 rounded-full"
                width={"100px"}
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
          <div className=" flex flex-col justify-start gap-2">
            <div className="flex flex-wrap flex-row gap-3">
              <input
                id="picture"
                ref={ImageFileInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  debugger
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
              <Button variant="continue" onClick={handleUpload}>
                {`${value ? "Update" : "Upload"} ${label}`}
              </Button>
              {value && (
                <Button variant="continue" onClick={handlRemove}>
                  {`Remove`}
                </Button>
              )}
              {error && touch && <div className={errorClassName}>{error}</div>}
            </div>
            <span className="text-neutral-800 text-xs font-normal">
              JPEG or PNG. Max size of 100KB
            </span>
          </div>
        </div>
      </>
    );
  }
);

export default ImageInput;
