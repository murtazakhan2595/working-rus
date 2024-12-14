import React, { useEffect, useRef, useState } from "react";
import { Plus, Search } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../../src/@/components/ui/popover";
import plus from "assets/images/plus.svg";
import {
  TextInput,
  SelectComponent,
  DateInput,
} from "components/form-control.jsx";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { filebase64Download } from "utils/fileUtils";
import { Checkbox } from "../../../../src/@/components/ui/checkbox";
import { Card } from "components/ui/card";
import { AiOutlineDownload } from "react-icons/ai";
import { FaRegImage } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getDarkerTextColor } from "../Boards/Sections/getTaskStatus";
import { Members } from "app/modules/TaskManagment/Sections";

export default function Attachments({
  attachmentSelected,
  removeFile,
  onChange,
  editMode = true,
}) {
  const fileInputRef = useRef(null);

  return (
    <div className="w-full max-w-sm mx-auto flex">
      <div style={{ maxWidth: "85%" }}>
        {attachmentSelected.length > 0 && (
          <div className="">
            {attachmentSelected?.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between w-full gap-2 p-4 my-1 border border-gray-400 rounded-lg"
              >
                <div className="flex items-center">
                  <div
                    className="flex items-center justify-center w-8 h-8"
                    style={{ minWidth: "2rem" }}
                  >
                    {" "}
                    {/* File preview based on type */}
                    {(() => {
                      const fileType = file?.attachments
                        ?.split(".")
                        .pop()
                        ?.toLowerCase();
                      if (["jpg", "jpeg", "png", "gif"].includes(fileType)) {
                        return (
                          <img
                            src={file?.attachments}
                            alt={file?.name}
                            className="w-8 h-8"
                          />
                        );
                      } else {
                        return (
                          <span className="text-xs font-semibold justify-center items-center text-gray-700 m-auto bg-gray-300 rounded-lg w-full h-full flex">
                            {fileType?.toUpperCase() || "FILE"}
                          </span>
                        );
                      }
                    })()}
                  </div>
                  <span className="ml-4 text-sm text-baseGray">
                    <a
                      href={
                        file.attachments instanceof File
                          ? URL.createObjectURL(file.attachments)
                          : file.attachments
                      } // Create a blob URL for the file
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-gray-700"
                    >
                      {file.name || "Attachment"}
                    </a>
                  </span>
                </div>
                <div className="flex items-center gap-x-2">
                  <div
                    href={file?.attachments}
                    download
                    onClick={() => {
                      filebase64Download(file?.attachments, file?.name);
                    }}
                    className="text-gray-500 hover:text-gray-700 download-icon"
                  >
                    <AiOutlineDownload className="w-5 h-5" />
                  </div>
                  {editMode && (
                    <MdClose
                      className="w-5 h-5 text-gray-500 cursor-pointer"
                      onClick={() => {
                        removeFile(file);
                      }}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {editMode && (
        <Popover>
          <Button
            variant="outline"
            className="w-10 h-10 p-0 rounded-full"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              fileInputRef.current.click();
            }}
          >
            <Plus className="w-4 h-4" />
          </Button>
          <Input
            type="file"
            multiple
            style={{ display: "none" }}
            onClick={(event) => event.stopPropagation()} // Prevent default behavior
            onChange={(event) => onChange(event)}
            ref={fileInputRef}
          />
        </Popover>
      )}
    </div>
  );
}
