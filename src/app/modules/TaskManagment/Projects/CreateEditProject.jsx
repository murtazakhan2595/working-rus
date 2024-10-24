import React, { useRef, useState } from "react";
import SheetComponent from "components/ui/SheetComponent";
import ProjectForm from "app/modules/TaskManagment/Projects/ProjectForm";

const CreateEditProject = ({ project, isEditMode, isOpen, setIsOpen }) => {
  console.log("isEditMode", isEditMode);
  console.log("isOpen", isOpen);
  const formRef = useRef();
  const handleSubmit = (values, resetForm) => {
    resetForm();
  };

  const validationEmployeeInfoFormSchema = (values, isEditMode) => {
    const errors = {};
    // Add your validation logic here
    return errors;
  };

  const validateUsername = (value) => {
    // Add your username validation logic here
  };

  const formSheetData = {
    triggerText: `${isEditMode ? "" : "Add New Project"}`,
    title: `${isEditMode ? "" : "Add New Project"}`,
    description: null,
    footer: null,
  };

  return (
    <div>
      <SheetComponent
        {...formSheetData}
        onSubmit={handleSubmit}
        width="860px"
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        contentClassName="custom-sheet-width"
      >
        <ProjectForm
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          editProject={project}
          isEditMode={isEditMode}
        />
      </SheetComponent>
    </div>
  );
};

export default CreateEditProject;
