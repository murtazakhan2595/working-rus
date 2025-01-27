import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
} from "src/@/components/ui/dialog.jsx";
import { Button } from "components/ui/button";
import { Formik, Form } from "formik";
import { TextInput, SelectComponent } from "components/FormControl";
import { CustomField } from "app/utils/Types/TaskManagment";
import { CustomeFieldTypeOption } from "data/Data";
import { Trash, GripHorizontal } from "lucide-react";
import { addProject } from "app/hooks/taskManagment";
import { toast } from "react-toastify";

const AddProjectCustomFieldForm = ({ setIsOpen, isOpen, projectId, projectData,reloadData=()=>{} }) => {
  const [isLoading, setIsLoading] = useState(false);
  const customFieldsFormRef = useRef();
  const [initialValues, setInitialValues] = useState(CustomField);
  const [draggedItem, setDraggedItem] = useState(null);

  useEffect(() => {
    if (!isOpen) {
      setInitialValues(CustomField); // Reset form on dialog close
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
    const newOption = {
      id: options.length + 1, // Ensure unique id
      value: `Option ${options.length + 1}`,
    };
    props.setFieldValue("options", [...options, newOption]);
  };

  const deleteOption = (option, options, props) => {
    const filteredOptions = options.filter((opt) => opt.id !== option.id);
    props.setFieldValue("options", filteredOptions);
  };

  const handleSubmit = async (values) => {
    debugger;
    setIsLoading(true);
    try {
      const custom_fields = [...(projectData.custom_fields || []), values];
      const response = await addProject(
        { custom_fields: custom_fields },
        projectId
      );
      if (response) {
        reloadData(projectId);
        setIsOpen(false);
        toast.success("Custom Field Added successfully");
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
          <DialogTitle className="text-plum-900">New Field</DialogTitle>
          <DialogDescription className="text-gray-900">
            Add a new custom field
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
                  name="name"
                  error={props.errors.name}
                  label="Title"
                  touch={props.touched.name}
                  value={props.values.name}
                  required={true}
                  onChange={(field, value) => props.setFieldValue(field, value)}
                />
                <SelectComponent
                  name="type"
                  options={CustomeFieldTypeOption}
                  error={props.errors.type}
                  touch={props.touched.type}
                  value={props.values.type}
                  label="Type"
                  placeholder="Select Field Type"
                  onChange={(field, value) => props.setFieldValue(field, value)}
                />

                {props.values.type === "SELECT_DROPDOWN" && (
                  <div className="space-y-4 mb-6">
                    {props.values.options.map((option, index) => (
                      <div
                        key={option.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, option)}
                        onDragOver={(e) =>
                          handleDragOver(e, option, props.values.options, props)
                        }
                        onDragEnd={handleDragEnd}
                        className="flex items-center justify-between space-x-2 bg-white"
                      >
                        <GripHorizontal className="cursor-move" />
                        <div className="w-[calc(100%_-_80px)]">
                          <TextInput
                            name={`options[${index}].value`}
                            error={props.errors.options?.[index]?.value}
                            touch={props.touched.options?.[index]?.value}
                            value={option.value}
                            onChange={(field, value) => {
                              const updatedOptions = [...props.values.options];
                              updatedOptions[index].value = value;
                              props.setFieldValue("options", updatedOptions);
                            }}
                          />
                        </div>
                        <Trash
                          size={16}
                          className="text-red-300 cursor-pointer"
                          onClick={() =>
                            deleteOption(option, props.values.options, props)
                          }
                        />
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(event) => {
                        event.preventDefault();
                        addOption(props.values.options, props);
                      }}
                    >
                      Add Option
                    </Button>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 mt-4 border-t border-gray-200 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" isLoading={isLoading}>
                  {isLoading ? "Saving..." : "Create"}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};


export default AddProjectCustomFieldForm;
