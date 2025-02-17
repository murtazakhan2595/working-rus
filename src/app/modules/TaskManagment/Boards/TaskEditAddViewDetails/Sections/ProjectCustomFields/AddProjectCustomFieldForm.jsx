import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
} from "src/@/components/ui/dialog.jsx";
import { Button } from "components/ui/button";
import { Formik, Form } from "formik";
import { TextInput, SelectInputComponent } from "components/FormControl";
import { CustomFieldData } from "app/utils/Types/TaskManagment";
import { mapCustomFieldPayloadData } from "app/utils/MappingObjects/mapTaskManagementData";
import { CustomeFieldTypeOption } from "data/Data";
import { Trash, GripHorizontal } from "lucide-react";
import { addCustomFields,deleteCustomFields } from "app/hooks/taskManagment";
import { toast } from "react-toastify";

const AddProjectCustomFieldForm = ({
  setIsOpen,
  isOpen,
  projectId,
  customFieldData = null,
  customFieldId = null,
  reloadData = () => {},
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const customFieldsFormRef = useRef();
  const [initialValues, setInitialValues] = useState(
    customFieldData ?? CustomFieldData
  );
  const [draggedItem, setDraggedItem] = useState(null);

  useEffect(() => {
    if (!isOpen) {
      setInitialValues(CustomFieldData); // Reset form on dialog close
    }
  }, [isOpen]);

  const handleDragStart = (e, option) => {
    setDraggedItem(option);
  };

  const handleDragOver = (e, targetOption, options, props) => {
    e.preventDefault();
    if (!draggedItem || draggedItem.id === targetOption.id) return;

    const newOptions = [...options];
    const draggedIndex = newOptions.findIndex(
      (opt) => opt.id === draggedItem.id
    );
    const targetIndex = newOptions.findIndex(
      (opt) => opt.id === targetOption.id
    );

    // Reorder the array
    newOptions.splice(draggedIndex, 1);
    newOptions.splice(targetIndex, 0, draggedItem);

    props.setFieldValue("options", newOptions);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const addOption = (options, props) => {
    props.setFieldValue("value", [...options, ""]);
  };

  const deleteOption = (option, options, props) => {
    const filteredOptions = options.filter((opt) => opt.id !== option.id);
    props.setFieldValue("options", filteredOptions);
  };

  const handleSubmit = async (values) => {
    setIsLoading(true);
    try {
      const payload = mapCustomFieldPayloadData(
        values,
        projectId,
        customFieldId
      );
      const response = await addCustomFields(payload, customFieldId);
      if (response) {
        reloadData();
        setIsOpen(false);
        toast.success("Custom Field Added successfully");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const response = await deleteCustomFields(customFieldId);
      if (response) {
        reloadData();
        setIsOpen(false);
        toast.success("Custom Field Deleted successfully");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => setIsOpen(false)}>
      <DialogContent className="max-w-[450px] max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-plum-900">
            {`${customFieldId ? "Modify" : "New"}`} Field
          </DialogTitle>
          <DialogDescription className="text-gray-900">
            {`${
              customFieldId
                ? "Rename tile or modify this field"
                : "Add a new custom field"
            }`}
          </DialogDescription>
        </DialogHeader>

        <Formik
          initialValues={initialValues}
          innerRef={customFieldsFormRef}
          enableReinitialize={true}
          onSubmit={handleSubmit}
        >
          {(props) => (
            <Form>
              <div className="space-y-4">
                <TextInput
                  name="field_name"
                  error={props.errors.field_name}
                  label="Title"
                  touch={props.touched.field_name}
                  value={props.values.field_name}
                  required={true}
                  onChange={(field, value) => props.setFieldValue(field, value)}
                />
                <SelectInputComponent
                  name="field_type"
                  options={CustomeFieldTypeOption}
                  error={props.errors.field_type}
                  touch={props.touched.field_type}
                  value={props.values.field_type}
                  label="Type"
                  placeholder="Select Field Type"
                  onChange={(field, value) => props.setFieldValue(field, value)}
                />
                {props.values.field_type === "SELECT_DROPDOWN" && (
                  <div className="space-y-4 mb-6">
                    {props.values.value &&
                      Array.isArray(props.values.value) &&
                      props.values.value.map((option, index) => (
                        <div
                          key={index}
                          // draggable
                          // onDragStart={(e) => handleDragStart(e, option)}
                          // onDragOver={(e) =>
                          //   handleDragOver(
                          //     e,
                          //     option,
                          //     props.values.options,
                          //     props
                          //   )
                          // }
                          // onDragEnd={handleDragEnd}
                          className="flex items-center justify-between space-x-2 bg-white"
                        >
                          {/* <GripHorizontal className="cursor-move" /> */}
                          <div className="w-[calc(100%_-_80px)]">
                            <TextInput
                              name={`option[${index}]`}
                              // error={props.errors.options?.[index]?.value}
                              // touch={props.touched.options?.[index]?.value}
                              value={option}
                              onChange={(field, value) => {
                                const Options = props.values.value || null;
                                Options[index] = value;
                                props.setFieldValue("value", Options);
                              }}
                            />
                          </div>
                          <Trash
                            size={16}
                            className="text-red-300 cursor-pointer"
                            onClick={() =>
                              deleteOption(
                                option,
                                props.values.value || [],
                                props
                              )
                            }
                          />
                        </div>
                      ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(event) => {
                        event.preventDefault();
                        addOption(props.values.value || [], props);
                      }}
                    >
                      Add Option
                    </Button>
                  </div>
                )}
              </div>
              <div className="flex justify-between">
                <div className="flex justify-start gap-2 mt-4 border-t border-gray-200 pt-4">
                  {customFieldId && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={(e) => {
                        e.preventDefault();
                        handleDelete();
                      }}
                    >
                      Delete
                    </Button>
                  )}
                </div>

                <div className="flex justify-end gap-2 mt-4 border-t border-gray-200 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsOpen(false);
                    }}
                  >
                    Cancel
                  </Button>
                  {customFieldId ? (
                    <Button type="submit" isLoading={isLoading}>
                      {isLoading ? "Modifying..." : "Modify"}
                    </Button>
                  ) : (
                    <Button type="submit" isLoading={isLoading}>
                      {isLoading ? "Saving..." : "Create"}
                    </Button>
                  )}
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default AddProjectCustomFieldForm;
