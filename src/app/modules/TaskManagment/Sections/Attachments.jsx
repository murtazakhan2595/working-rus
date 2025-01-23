import React, { useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";
import { Popover } from "src/@/components/ui/popover";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { deleteAttachment } from "app/hooks/taskManagment";
import AttachmentUI from "components/ui/AttachmentUI";
import {
  TaskDetailBox,
  TaskFieldDataContent,
  TaskFieldInputContent,
} from "app/modules/TaskManagment/Sections";
import { CoverFileUpload } from "components/FormControl";

export default function Attachments({
  attachmentSelected,
  onChange,
  maxAttachments,
  error,
  touch,
  editMode = true,
}) {
  const fileInputRef = useRef(null);
  const removeFile = async (file, id) => {
    if (id) {
      try {
        const response = await deleteAttachment(id);
        if (response) {
          const filteredFiles = attachmentSelected.filter((f) => f.id !== id);
          onChange(filteredFiles);
        }
      } catch (error) {
        console.error("Error removing checklist item:", error);
      }
    } else {
      const filteredFiles = attachmentSelected.filter(
        (f) => f.name !== file.name
      );
      onChange(filteredFiles);
    }
  };
  const handleAttachmentsChange = (event) => {
    const selectedFiles = Array.from(event.target.files); // Convert FileList to an array
    const existingFiles = attachmentSelected;

    // Map selected files to the desired format
    const formattedFiles = selectedFiles.map((file) => ({
      attachments: file,
      id: null,
      name: file.name,
    }));

    // Merge new files with existing ones
    onChange([...formattedFiles, ...existingFiles]);
  };
  return (
    <div className=" flex flex-col w-full">
      {((attachmentSelected && attachmentSelected.length < maxAttachments) ||
        !maxAttachments) && (
        <CoverFileUpload
          acceptType=".pdf"
          name={`attachment`}
          //value={props.values.attachment}
          onChange={(field, value) => {
            onChange(value);
          }}
          label={"Attachments"}
          error={error}
          touch={touch}
        />
      )}
      {attachmentSelected && attachmentSelected.length > 0 ? (
        <div className="flex flex-col w-full">
          {attachmentSelected?.map((file, index) => (
            <AttachmentUI
              attachment={file.attachments}
              name={file.name}
              removeFile={editMode ? removeFile : null}
              id={file.id}
              key={index}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
