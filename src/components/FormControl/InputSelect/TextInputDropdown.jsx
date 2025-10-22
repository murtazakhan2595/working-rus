import React, { useState, useCallback } from "react";
import { ChevronsUpDown } from "lucide-react";
import {
    SelectableOptionsList,
    DropdownIcon,
} from "components/FormControl/InputSelect";
import {
    FormField,
    FormPopoverButton,
    FormPlaceholder,
    FormFieldIcon,
    inputButtonClassName,
    TextInput,
} from "components/FormControl";
import { Input } from "components/ui/input";


const regEx = /^[a-zA-Z0-9]+$/;
const TextInputDropdown = React.memo(
    ({
        name,
        options = [], // List of selectable options
        error,
        touch,
        value = null, // Current selected values
        label = null, // Label for the select field
        onChange = () => { }, // Function to handle selection change
        required = false, // Whether the field is required
        className = "w-full", // Custom styling
        inputCustomStyle = "", // Custom styling
        icon, // Optional icon inside the button
        allowNewOption = false, // Whether users can add new options
        newOptionConfig = {}, // Configuration for new options
        showOptionsActions = false, // Show additional actions for options
        optionsActions = [], // List of action buttons for options
        placeholder = null, // Placeholder text when no value is selected
        disabled = false,
        SelectAllOption = false,
    }) => {
        const [isOpen, setIsOpen] = useState(false);
        // Toggle selection for a given option
        const handleSelectionToggle = useCallback(
            (optionValue) => {
                const newValue =
                    optionValue === value || (optionValue === null && value === null)
                        ? ""
                        : optionValue;
                setIsOpen(false);
                onChange(name, newValue);
            },
            [onChange, name]
        );
        const DropdownList = React.useMemo(
            () =>
                SelectAllOption
                    ? [{ label: "All", value: null }, ...(options || [])]
                    : options || [],
            [SelectAllOption, options]
        );

        const SelectedValueLabel = React.useMemo(() => {
            if (SelectAllOption && !value) return "All";

            const selectedOption = DropdownList
                ? DropdownList.find((option) => String(option.value) === String(value))
                : null;

            return selectedOption ? selectedOption.label : value;
        }, [SelectAllOption, value, DropdownList]);

        return (
            <FormField
                name={name}
                label={label}
                required={required}
                error={error}
                touched={touch}
                className={className}
                disabled={disabled}
            >
                <FormPopoverButton
                    open={isOpen}
                    setOpen={setIsOpen}
                    disabled={disabled}
                    invalidField={!!(error && touch)}
                    className={`${inputCustomStyle} py-0`}
                    triggerContent={
                        <div className="flex justify-start w-full gap-2 items-center">
                            <FormFieldIcon icon={icon} />
                            <Input
                                type="text"
                                maxLength={"100"}
                                id={name}
                                name={name}
                                placeholder={placeholder ? placeholder : `Select ${label ?? ""}`}
                                value={SelectedValueLabel || ""}
                                disabled={disabled}
                                className={`${inputButtonClassName} border-none`}
                                onChange={(event) => {
                                    const inputValue = event.target.value
                                    if (!inputValue || regEx.test(inputValue)) {
                                        onChange(name, inputValue);
                                    }
                                }}
                            />
                            <DropdownIcon />
                        </div>
                    }
                    popoverContent={
                        <SelectableOptionsList
                            options={DropdownList}
                            selectedValues={[value]}
                            handleSelectionToggle={handleSelectionToggle}
                            showOptionsActions={showOptionsActions}
                            optionsActions={optionsActions}
                            allowNewOption={allowNewOption}
                            newOptionConfig={newOptionConfig}
                        />
                    }
                />
            </FormField>
        );
    }
);

export default TextInputDropdown;
