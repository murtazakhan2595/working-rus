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
import { Label } from "../../../../src/@/components/ui/label";
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
}) {
  const fileInputRef = useRef(null);

  return (
    <div className="w-full max-w-sm mx-auto flex">
      <div style={{ maxWidth: "85%" }}>
        {attachmentSelected.length > 0 && (
          <div className="">
            {attachmentSelected.map((file, index) => (
              <div
                className="flex items-center justify-between p-2 mb-2 bg-gray-100 rounded-lg shadow-md w-fit"
                key={index}
              >
                <div className="flex items-center">
                  <FaRegImage className="w-4 h-4 text-gray-500" />
                  <span className="ml-4 text-sm text-baseGray">
                    {file.attachments instanceof File ? (
                      // Handle file objects
                      <a
                        href={URL.createObjectURL(file.attachments)} // Create a blob URL for the file
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-gray-700"
                      >
                        {file.name || "Attachment"}
                      </a>
                    ) : (typeof file && file.attachments === "string") ||
                      file.attachments ? (
                      // Handle URLs
                      <a
                        href={file.attachments} // Use the URL directly
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-gray-700"
                      >
                        {file.name || "Attachment"}
                      </a>
                    ) : null}
                  </span>
                </div>
                <div className="flex items-center gap-x-2">
                  <MdClose
                    className="w-5 h-5 text-gray-500 cursor-pointer"
                    onClick={() => {
                      removeFile(file);
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Popover>
        <Button
          variant="outline"
          className="w-10 h-10 p-0 rounded-full"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
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
    </div>
  );
}
