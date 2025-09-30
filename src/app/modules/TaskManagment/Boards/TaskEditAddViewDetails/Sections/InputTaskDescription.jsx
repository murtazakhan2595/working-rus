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
            onChange={onChange}
            name={name}
            setAttachments={setAttachment}
            attachments={attachments}
            // removeAttachment={removeFile}
            upload={async (file) => {
              return await uploadAttachmentFile({ attachment: file });
            }}
          />
        ) : (
            <div className="border border-neutral-500 p-2 pr-0 rounded-sm block textEditorText min-h-[150px]">
              <TextUI
                text={value}
                isHTMLText={true}
                className={"text-neutral-1200"}
                height={"300px"}
              />
            </div>
        )}
      </div>
    );
  }
);

export default InputTaskDescription;
