import React, { useState } from "react";
import { TextInput } from "components/FormControl";
import { TextEditorInputField } from "components/FormControl";

const InputTaskDescription = ({ onChange, error, value, touched, name }) => {
  const [editingMode, setEditingMode] = useState(false);
  return (
    <div onClick={() => setEditingMode(true)}>
      {editingMode ? (
        <div className="min-w-[400px]">
          <TextEditorInputField
            content={value}
            setContent={(value) => {
                onChange(name, value);
              }}
            // setAttachments={setCommentAttachment}
            // attachments={commentAttachments}
            // removeAttachment={removeFile}
            // upload={async (file) => {
            //   return await handleAddCommentAttachment(file);
            // }}
          />
        </div>
      ) : (
        <div
          className="cursor-pointer border border-neutral-500 text-neutral-1200 p-2 rounded block min-h-[150px]"
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
