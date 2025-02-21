import React, { useState } from "react";
import { TextUI } from "components";
import { TextEditorInputField } from "components/FormControl";

const InputTaskDescription = React.memo(
  ({
    onChange,
    value,
    setAttachment,
    attachments,
    name,
    uploadAttachmentFile,
  }) => {
    const [editingMode, setEditingMode] = useState(false);
    return (
      <div
        onDoubleClick={(e) => {
          e.preventDefault();
          setEditingMode(true);
        }}
      >
        {editingMode ? (
          <TextEditorInputField
            content={value}
            setContent={(value) => {
              onChange(name, value);
            }}
            name={name}
            setAttachments={setAttachment}
            attachments={attachments}
            // removeAttachment={removeFile}
            upload={async (file) => {
              return await uploadAttachmentFile({ attachment: file });
            }}
          />
        ) : (
          <div
            className="border border-neutral-500 p-2 rounded-sm block min-h-[150px] max-h-[350px] overflow-y-scroll textEditorText"
            // dangerouslySetInnerHTML={{
            //   __html: value,
            // }}
          >
            <TextUI
              text={value}
              isHTMLText={true}
              className={"text-neutral-1200"}
            />
          </div>
        )}
      </div>
    );
  }
);

export default InputTaskDescription;
