import React, { useRef, useState } from "react";
import SheetComponent from "components/ui/SheetComponent";
import ProjectForm from "app/modules/TaskManagment/Projects/ProjectForm";

const CreateEditProject = ({
  project,
  isEditMode,
  isOpen,
  setIsOpen,
  reload,
}) => {
  const formRef = useRef();
  const handleSubmit = (values, resetForm) => {
    resetForm();
  };

  const formSheetData = {
    triggerText: `${isEditMode ? "Update Project" : "Add New Project"}`,
    title: `${isEditMode ? "Update Project" : "Add New Project"}`,
    description: null,
    footer: null,
  };

  return (
    <div>
      <SheetComponent
        {...formSheetData}
        onSubmit={handleSubmit}
       width="500px"
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        contentClassName="custom-sheet-width"
      >
        <ProjectForm
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          editProject={project}
          isEditMode={isEditMode}
          reload={reload}
        />
      </SheetComponent>
    </div>
  );
};

export default CreateEditProject;
