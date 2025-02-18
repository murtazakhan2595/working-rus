import React, { useMemo } from "react";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { Label } from "src/@/components/ui/label";
import { errorClassName } from "components/FormControl";
import { CircleX } from "lucide-react";
import PresetCustom from "./PresetCustom";
import { DEFAULT_LIST_COLOR_OPTIONS } from "app/utils/Types/TaskManagment";
import {
  FormField,
  FormPopoverButton,
  FormPlaceholder,
  FormFieldIcon,
} from "components/FormControl";
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
 * @param {boolean} props.touch - Indicates if the field has been touched
 * @param {string} props.selectedColor - Currently selected color value
 * @param {Function} props.onChange - Callback function for color selection
 * @param {"palette" | "dropdown" | "text-input" | "preset-custom"} props.variant - UI variant of the color picker
 */
const ColorPicker = React.memo(
  ({
    COLOR_OPTIONS = DEFAULT_LIST_COLOR_OPTIONS,
    label = null,
    name = null,
    required = false,
    error = null,
    touch = false,
    selectedColor = "",
    onChange = () => {},
    variant = "palette", // Available variants: "palette", "dropdown", "text-input"
    allowCustomInput = false,
    className = "w-full", // Custom styling
  }) => {
    /**
     * Memoized color options list, allowing dynamic updates when custom colors are added.
     */
    const colorOptions = useMemo(() => {
      return selectedColor && !COLOR_OPTIONS.includes(selectedColor)
        ? [...COLOR_OPTIONS, selectedColor]
        : COLOR_OPTIONS;
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
      <FormField
        name={name}
        label={label}
        required={required}
        error={error}
        touched={touch}
        className={className}
      >
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

          {/* Preset Custom Input */}
          {variant === "preset-custom" && (
            <PresetCustom
              COLOR_OPTIONS={colorOptions}
              selectedColor={selectedColor}
              handleColorSelection={handleColorSelection}
            />
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
              className={error && touch ? "is-invalid" : "text-neutral-1000"}
              onChange={(e) => {
                const value = e.target.value;
                onChange(name, value);
              }}
            />
          )}
        </div>
      </FormField>
    );
  }
);

export default ColorPicker;
