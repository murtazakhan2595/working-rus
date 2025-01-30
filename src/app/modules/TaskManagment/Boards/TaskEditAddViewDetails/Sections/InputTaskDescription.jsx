import React, { useState } from "react";
import { TextInput } from "components/FormControl";
import { TextEditorInputField } from "components/FormControl";

const InputTaskDescription = ({
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
      {editingMode || !value ? (
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
          className="cursor-pointer border border-neutral-500 text-neutral-1200 p-2 rounded block min-h-[150px] max-h-[350px] overflow-y-scroll textEditorText"
          //   onDoubleClick={() => setEditingField("description")}
          dangerouslySetInnerHTML={{
            __html: value,
          }}
        />
      )}
    </div>
  );
};

export default InputTaskDescription;
