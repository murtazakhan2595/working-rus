import React, { useState } from "react";
import { Button } from "components/ui/button";
import moment from "moment";
import { Tag, Info, Check, X, Settings } from "lucide-react";
import AlertDialogue from "components/ui/AlertDialogue";

const CategoryView = ({ categoryData, onEdit, onDelete, onClose }) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Organize category details
  const categoryDetails = [
    { label: "Category Name", value: categoryData.name },
    {
      label: "Description",
      value: categoryData.description || "No description provided",
    },
    {
      label: "Status",
      value: (
        <span
          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
            categoryData.is_active
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {categoryData.is_active ? <Check size={12} /> : <X size={12} />}
          {categoryData.is_active ? "Active" : "Inactive"}
        </span>
      ),
    },
  ];

  // Helper function to format field type
  const formatFieldType = (type) => {
    const types = {
      text: "Text",
      textarea: "Textarea",
      select: "Select",
      number: "Number",
      date: "Date",
      checkbox: "Checkbox",
    };
    return types[type] || type;
  };

  // Helper function to format validation rules
  const formatValidationRules = (rules) => {
    if (!rules || Object.keys(rules).length === 0) return "None";

    const ruleStrings = [];
    if (rules.min !== undefined) ruleStrings.push(`Min: ${rules.min}`);
    if (rules.max !== undefined) ruleStrings.push(`Max: ${rules.max}`);
    if (rules.maxLength !== undefined)
      ruleStrings.push(`Max Length: ${rules.maxLength}`);

    return ruleStrings.join(", ") || "None";
  };

  // Handle delete confirmation
  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    onDelete();
    setIsDeleteDialogOpen(false);
  };

  return (
    <div className="w-full p-0">
      <div className="flex flex-col">
        <div className="flex-grow">
          <div className="p-0">
            <div className="flex items-center justify-end mb-6">
              <div className="flex items-center gap-3">
                <Button
                  onClick={onEdit}
                  className="border bg-white border-[#e8e8ec] text-neutral-1200 text-xs font-semibold font-[inter]"
                >
                  Edit
                </Button>
                <Button
                  onClick={handleDeleteClick}
                  className="border bg-white border-[#e8e8ec] text-neutral-1200 text-xs font-semibold font-[inter]"
                >
                  Delete
                </Button>

                {/* Delete Confirmation Dialog */}
                {isDeleteDialogOpen && (
                  <AlertDialogue
                    isOpen={isDeleteDialogOpen}
                    setIsOpen={setIsDeleteDialogOpen}
                    handleContinue={handleConfirmDelete}
                    continueText="Delete"
                    title={`Are you sure you want to delete "${categoryData.name}"?`}
                    description="This action cannot be undone. All assets in this category will lose their category assignment."
                  />
                )}
              </div>
            </div>

            {/* Category Details Section */}
            <div className="font-[inter] mt-5 flex flex-grow flex-col gap-y-[16px] rounded-lg border border-solid border-zinc-200 text-sm font-medium leading-[1.2] tracking-[0px]">
              <section className="flex flex-col justify-center p-6 text-sm bg-white">
                <div className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                  Basic Information
                </div>
                <div className="flex w-full mt-3">
                  <div className="flex flex-col flex-1 shrink justify-center pr-11 w-full basis-0 min-w-[240px]">
                    {categoryDetails.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center max-w-full gap-4 mt-4"
                      >
                        <div className="flex flex-col leading-none min-w-[88px] w-[132px]">
                          <div>{item.label}</div>
                        </div>
                        <div className="flex-1 leading-5 text-neutral-900 shrink basis-0">
                          {item.value || "N/A"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
              <div className="h-[45px] px-6 pt-[13px] pb-3 bg-zinc-100/50 border-t border-zinc-200 justify-start items-center inline-flex">
                <div className="inline-flex flex-col items-start justify-start grow shrink basis-0">
                  <div>
                    <span className="text-[#8b8d98] text-xs font-medium leading-tight">
                      Created on:
                    </span>
                    <span className="text-[#8b8d98] text-xs font-normal leading-3">
                      {` ${moment(categoryData?.created_at).format(
                        "MMMM DD, YYYY"
                      )}`}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Dynamic Fields Section */}
            {categoryData.dynamic_fields &&
              categoryData.dynamic_fields.length > 0 && (
                <div className="font-[inter] mt-5 flex flex-grow flex-col gap-y-[16px] rounded-lg border border-solid border-zinc-200 text-sm font-medium leading-[1.2] tracking-[0px]">
                  <section className="flex flex-col justify-center p-6 text-sm bg-white">
                    <div className="text-sm font-semibold text-gray-900 whitespace-nowrap flex items-center gap-2">
                      <Settings size={16} />
                      Dynamic Fields
                    </div>
                    <div className="flex w-full mt-3">
                      <div className="flex flex-col flex-1 w-full">
                        {categoryData.dynamic_fields.map((field, index) => (
                          <div
                            key={index}
                            className="p-4 mt-4 border rounded-lg bg-gray-50"
                          >
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <span className="text-xs text-gray-500">
                                  Field Name
                                </span>
                                <div className="font-medium">
                                  {field.field_name}
                                </div>
                              </div>
                              <div>
                                <span className="text-xs text-gray-500">
                                  Type
                                </span>
                                <div className="font-medium">
                                  {formatFieldType(field.field_type)}
                                </div>
                              </div>
                              <div>
                                <span className="text-xs text-gray-500">
                                  Required
                                </span>
                                <div className="font-medium">
                                  <span
                                    className={`inline-flex items-center gap-1 ${
                                      field.is_required
                                        ? "text-red-600"
                                        : "text-gray-600"
                                    }`}
                                  >
                                    {field.is_required ? (
                                      <Check size={12} />
                                    ) : (
                                      <X size={12} />
                                    )}
                                    {field.is_required ? "Yes" : "No"}
                                  </span>
                                </div>
                              </div>
                              <div>
                                <span className="text-xs text-gray-500">
                                  Placeholder
                                </span>
                                <div className="font-medium">
                                  {field.placeholder || "None"}
                                </div>
                              </div>
                              {field.field_type === "select" && (
                                <div className="col-span-2">
                                  <span className="text-xs text-gray-500">
                                    Options
                                  </span>
                                  <div className="font-medium">
                                    {field.field_options &&
                                    field.field_options.length > 0
                                      ? field.field_options.join(", ")
                                      : "No options defined"}
                                  </div>
                                </div>
                              )}
                              {field.field_type === "number" && (
                                <div className="col-span-2">
                                  <span className="text-xs text-gray-500">
                                    Validation Rules
                                  </span>
                                  <div className="font-medium">
                                    {formatValidationRules(
                                      field.validation_rules
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                </div>
              )}

            {/* Footer Button */}
            <div className="flex justify-end mt-6">
              <Button variant="outline" size="lg" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryView;
