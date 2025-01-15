import React from "react";

export default function TaskDetailBox({
  dataContent,
  inputDataContent = null,
  editMode = true,
}) {
  return (
    <div className="flex w-full">
      {dataContent && (
        <div className={`${editMode ? "w-[calc(100%_-_56px)]" : ""}`}>
          {dataContent}
        </div>
      )}
      {editMode && (
        <div
          style={{
            minWidth: "40px",
            ...(dataContent && { marginLeft: "1rem" }),
          }}
        >
          {inputDataContent}
        </div>
      )}
    </div>
  );
}
