import React from "react";

export default function TaskDetailBox({
  dataContent,
  inputDataContent = null,
  editMode = true,
}) {
  return (
    <div className="max-w-sm flex w-full">
      <div className={`${dataContent && editMode ? "w-[82%]" : ""}`}> {dataContent}</div>
      {editMode && (
        <div style={{ minWidth: "11.5%", marginLeft: "1rem" }}>
          {inputDataContent}
        </div>
      )}
    </div>
  );
}
