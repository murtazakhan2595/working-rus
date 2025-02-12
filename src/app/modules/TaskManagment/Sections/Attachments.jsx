import React, { useCallback } from "react";
import { CoverFileUpload } from "components/FormControl";
import { deleteAttachment } from "app/hooks/taskManagment";
import AttachmentUI from "components/ui/AttachmentUI";

const Attachments = React.memo(
  ({
    attachmentSelected,
    onChange,
    maxAttachments,
    error,
    touch,
    editMode = true,
    acceptedFileTypes = ".pdf",
    deleteAttachmentFile = () => {},
  }) => {
    const getFileAttachmentArray = useCallback((files) => {
      if (!files || !Array.isArray(files)) return [];
      return files.map((file) =>
        file instanceof File ? { attachment: file, name: file.name } : file
      );
    }, []);
    return (
      <div className="flex flex-col w-full">
        {((attachmentSelected && attachmentSelected.length < maxAttachments) ||
          !maxAttachments) && (
          <CoverFileUpload
            acceptType={acceptedFileTypes}
            name={`attachment`}
            value={attachmentSelected}
            onChange={(field, value) => onChange(getFileAttachmentArray(value))}
            label={"Attachments"}
            error={error}
            touch={touch}
            variant="AttachmentFileUpload"
            multiple={maxAttachments ? maxAttachments > 1 : true}
            deleteAttachment={deleteAttachmentFile}
            allowUpdate = {false}
          />
        )}
      </div>
    );
  },
  (prevProps, nextProps) =>
    prevProps.attachmentSelected === nextProps.attachmentSelected &&
    prevProps.maxAttachments === nextProps.maxAttachments &&
    prevProps.error === nextProps.error &&
    prevProps.touch === nextProps.touch &&
    prevProps.acceptedFileTypes === nextProps.acceptedFileTypes
);

export default Attachments;
