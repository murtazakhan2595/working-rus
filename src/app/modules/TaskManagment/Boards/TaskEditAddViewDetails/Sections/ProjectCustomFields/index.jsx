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
import { TextInput, SelectInputComponent } from "components/FormControl";
import AddProjectCustomFieldForm from "app/modules/TaskManagment/Boards/TaskEditAddViewDetails/Sections/ProjectCustomFields/AddProjectCustomFieldForm";
import { Trash, GripHorizontal, ArrowRight } from "lucide-react";
import { getAllCustomFields } from "app/hooks/taskManagment";

const ProjectCustomFields = ({
  setIsOpen,
  isOpen,
  projectId,
}) => {
  const [editCustomField, setEditCustomField] = useState(null);
  const [CustomFields, setCustomFields] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);
  const [openProjectCustomFieldsForm, setOpenProjectCustomFieldsForm] =
    useState(false);

  const fetchAllCustomFields = async (isMounted, projectID) => {
    if (projectID) {
      try {
        // Fetch card details
        const custom_fields = await getAllCustomFields(projectID);

        if (!custom_fields) {
          throw new Error("Card details not found.");
        }
        if (isMounted) {
          setCustomFields(custom_fields.results);
        }
      } catch (error) {
        console.error("Error fetching board list:", error);
      }
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (projectId) fetchAllCustomFields(isMounted, projectId);
    return () => {
      isMounted = false;
    };
  }, [projectId]);

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
  return (
    <Dialog open={isOpen} onOpenChange={() => setIsOpen(false)}>
      <DialogContent className="max-w-[450px] max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-plum-900">Custom Fields</DialogTitle>
          <DialogDescription className="text-gray-900">
            Add/modify custom fields
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mb-6">
          {CustomFields &&
            CustomFields.map((customField, index) => (
              <div
                key={index}
                // draggable
                // onDragStart={(e) => handleDragStart(e, customField)}
                // onDragOver={(e) => handleDragOver(e, customField)}
                // onDragEnd={handleDragEnd}
                className="flex items-center justify-start space-x-2 bg-white"
              >
                {/* <GripHorizontal className="cursor-move" /> */}
                <div className="min-w-[calc(100%_-_80px)]">
                  <TextInput
                    name={`options[${index}].value`}
                    value={customField.field_data.field_name}
                    onChange={() => {}}
                  />
                </div>
                <ArrowRight
                  size={16}
                  className="cursor-pointer"
                  onClick={() => {
                    setEditCustomField(customField);
                    setOpenProjectCustomFieldsForm(true);
                  }}
                />
                {/* <Trash
                  size={16}
                  className="text-red-300 cursor-pointer"
                  // onClick={() =>
                  //   //deleteOption(option, props.values.options, props)
                  // }
                /> */}
              </div>
            ))}
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={(event) => {
              event.preventDefault();
              setOpenProjectCustomFieldsForm(true);
            }}
          >
            Add New Field
          </Button>
          {openProjectCustomFieldsForm && (
            <AddProjectCustomFieldForm
              customFieldData={editCustomField?.field_data}
              customFieldId={editCustomField?.id}
              projectId={projectId}
              isOpen={openProjectCustomFieldsForm}
              setIsOpen={setOpenProjectCustomFieldsForm}
              reloadData={() => {
                fetchAllCustomFields(true, projectId);
                setEditCustomField(null);
              }}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const mapStateToProps = (state) => ({
  employees: state.emp.employees,
});

export default connect(mapStateToProps)(ProjectCustomFields);
