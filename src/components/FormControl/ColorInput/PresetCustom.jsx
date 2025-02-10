import React, { useState, useMemo } from "react";
import { cn } from "src/@/lib/utils";
import { inputButtonClassName } from "components/FormControl";

const PresetCustom = React.memo(
  ({
    COLOR_OPTIONS = [],
    selectedColor = "",
    handleColorSelection = () => {},
  }) => {
    console.log(COLOR_OPTIONS, selectedColor);
    return (
      <div className={cn(inputButtonClassName)}>
        <div className="flex flex-row flex-wrap gap-2">
          {COLOR_OPTIONS.map((color, index) => (
            <div
              key={index}
              className={cn(
                "w-5 h-5 rounded-full border border-neutral-500 cursor-pointer flex justify-center items-center"
              )}
              style={{ backgroundColor: color }}
              onClick={(e) => handleColorSelection(e, color)}
            >
              {selectedColor === color && (
                <div className="w-[6px] h-[6px] rounded-full bg-black"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }
);

export default PresetCustom;
