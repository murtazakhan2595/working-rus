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

export default function Attachments({
  attachmentSelected,
  onChange,
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
  console.log(attachmentSelected);
  return (
    <TaskDetailBox
      dataContent={
        attachmentSelected&&attachmentSelected.length > 0 ? (
          <div className="flex flex-col w-full">
            {attachmentSelected?.map((file, index) => (
              <div key={index}>
                <AttachmentUI
                  attachment={file.attachments}
                  name={file.name}
                  removeFile={removeFile}
                  id={file.id}
                />
              </div>
            ))}
          </div>
        ) : null
      }
      inputDataContent={
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
            onChange={(event) => handleAttachmentsChange(event)}
            ref={fileInputRef}
          />
        </Popover>
      }
      editMode={editMode}
    />
  );
}
