import React, { useMemo } from "react";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { Label } from "src/@/components/ui/label";
import { errorClassName } from "components/FormControl";
import { CircleX } from "lucide-react";

/**
 * Predefined color options for selection.
 */
const DEFAULT_COLOR_OPTIONS = [
  "#f2dede", // 80% lighter than #641e16
  "#ebebeb", // 80% lighter than #7b7d7d
  "#f7e6b0", // 80% lighter than #7d6608
  "#d2f2e4", // 80% lighter than #186a3b
  "#d1e8ff", // 80% lighter than #2874a6
  "#eed9f2", // 80% lighter than #6c3483
  "#fad3cf", // 80% lighter than #e74c3c
  "#f6e1d9", // 80% lighter than #CC6633
  "#fff4cc", // 80% lighter than #FFCC00
  "#e6f7d9", // 80% lighter than #669900
  "#d1f4fa", // 80% lighter than #00acc1
  "#d9dbfa", // 80% lighter than #5c6bc0
  "#ffe3b2", // 80% lighter than #ff9800
  "#c6f2da", // 80% lighter than #12B76A
];

/**
 * ColorPicker Component
 *
 * A reusable color selection component with multiple UI variants.
 * Supports predefined color selection and custom color input.
 *
 * @param {Object} props - Component props
 * @param {string} props.label - Label for the input
 * @param {string} props.name - Unique name for the input field
 * @param {boolean} props.required - Whether the field is required
 * @param {string} props.error - Validation error message
 * @param {boolean} props.touched - Indicates if the field has been touched
 * @param {string} props.selectedColor - Currently selected color value
 * @param {Function} props.onChange - Callback function for color selection
 * @param {"palette" | "dropdown" | "text-input"} props.variant - UI variant of the color picker
 */
const ColorPicker = React.memo(
  ({
    label = null,
    name = null,
    required = false,
    error = null,
    touched = false,
    selectedColor = "",
    onChange = () => {},
    variant = "palette", // Available variants: "palette", "dropdown", "text-input"
    allowCustomInput = false,
  }) => {
    /**
     * Memoized color options list, allowing dynamic updates when custom colors are added.
     */
    const colorOptions = useMemo(() => {
      return selectedColor && !DEFAULT_COLOR_OPTIONS.includes(selectedColor)
        ? [...DEFAULT_COLOR_OPTIONS, selectedColor]
        : DEFAULT_COLOR_OPTIONS;
    }, [selectedColor]);

    /**
     * Handles color selection when a predefined color is clicked.
     * @param {string} color - Selected color value
     */
    const handleColorSelection = (event, color) => {
      event.preventDefault(); // ✅ Prevents default behavior
      onChange(name, color);
    };

    /**
     * Renders different UI variants for the color picker.
     */
    return (
      <div className="flex flex-col gap-2">
        {/* Label */}
        {label && (
          <Label htmlFor={name}>
            {required && <span className="text-red-600">*</span>} {label}
          </Label>
        )}

        {/* Color Picker UI Variants */}
        <div className="space-y-4">
          {/* Color Palette (Grid Selection) */}
          {variant === "palette" && (
            <div className="grid grid-cols-5 gap-3">
              {colorOptions.map((color, index) => (
                <div className="relative">
                  <Button
                    key={index}
                    className={`w-full rounded transition-all ${
                      selectedColor === color
                        ? "ring-2 ring-offset-2 ring-black"
                        : ""
                    }`}
                    style={{ background: color }}
                    onClick={(e) => handleColorSelection(e, color)}
                  />
                  {selectedColor === color && (
                    <CircleX
                      className="absolute text-red-700 cursor-pointer bg-white top-[-15%] right-[-5%] rounded-full rounded-lg"
                      size={18}
                      onClick={(e) => handleColorSelection(e, "")}
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Dropdown Color Picker */}
          {variant === "dropdown" && (
            <select
              name={name}
              value={selectedColor}
              onChange={(e) => handleColorSelection(e.target.value)}
              className="border border-gray-300 rounded-md p-2 w-full"
            >
              {colorOptions.map((color, index) => (
                <option
                  key={index}
                  value={color}
                  style={{ backgroundColor: color }}
                >
                  {color}
                </option>
              ))}
            </select>
          )}

          {/* Custom Color Input */}
          {(variant === "text-input" || allowCustomInput) && (
            <Input
              type="text"
              id={name}
              name={name}
              autoComplete="off"
              placeholder="Enter Custom Color (#RRGGBB)"
              value={selectedColor}
              className={error && touched ? "is-invalid" : "text-neutral-1000"}
              onChange={(e) => {
                const value = e.target.value;
                onChange(name, value);
              }}
            />
          )}
        </div>

        {/* Error Message */}
        {error && touched && <div className={errorClassName}>{error}</div>}
      </div>
    );
  }
);

export default ColorPicker;
