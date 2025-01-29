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
  acceptedFileTypes = ".pdf",
}) {
  const getFileAttachmentArray = (files) => {
    if (!files || !Array.isArray(files)) return [];
    const updatedFiles = files.map((file) => {
      if (file instanceof File) {
        return { attachment: file, name: file.name };
      } else return file;
    });
    return updatedFiles;
  };
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
      attachment: file,
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
          acceptType={acceptedFileTypes}
          name={`attachment`}
          value={attachmentSelected}
          onChange={(field, value) => {
            onChange(getFileAttachmentArray(value));
          }}
          label={"Attachments"}
          error={error}
          touch={touch}
          variant="AttachmentFileUpload"
          multiple={maxAttachments ? maxAttachments > 1 : true}
        />
      )}
    </div>
  );
}
