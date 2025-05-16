import React, { useState } from "react";
import SheetComponent from "components/ui/SheetComponent";
import DropdownActionMenu from "components/DropdownActionMenu";
import AssignRoleForm from "./AssignRoleForm";
import ViewAssignedRole from "./ViewAssignedRole";

const AssignedRoleAction = ({ data, reload, roles }) => {
  const [view, setView] = useState(null);
  const [edit, setEdit] = useState(null);

  const formSheetData = {
    triggerText: null,
    title: "Update Role Assignment",
    description: null,
    footer: null,
  };

  const viewSheetData = {
    triggerText: null,
    title: "View Role Assignment",
    description: null,
    footer: null,
  };

  // Handle opening the view dialog
  const handleView = () => {
    setView({
      visible: true,
      data: data,
    });
  };

  // Handle opening the edit form
  const handleEdit = () => {
    setEdit({
      open: true,
      data: data,
    });
  };

  // Handle edit form close with optional reload
  const handleEditClose = (isOpen, updated = false) => {
    setEdit((prev) => ({ ...prev, open: isOpen }));

    // If the assignment was updated, reload the table
    if (updated && typeof reload === "function") {
      reload();
    }
  };

  // Handle view close with optional reload
  const handleViewClose = (isOpen, updated = false) => {
    setView((prev) => ({ ...prev, visible: isOpen }));

    // If the assignment was updated from the view, reload the table
    if (updated && typeof reload === "function") {
      reload();
    }
  };

  return (
    <>
      <DropdownActionMenu
        onView={handleView}
        onEdit={handleEdit}
        viewText="View Assignments"
        editText="Edit Assignments"
        menuTooltip={`Actions for ${data?.employee?.name}`}
      />

      {/* Edit Assignment Sheet */}
      {edit?.open && (
        <SheetComponent
          {...formSheetData}
          isOpen={edit.open}
          setIsOpen={(isOpen) => handleEditClose(isOpen)}
          width="568px"
        >
          <AssignRoleForm
            isOpen={edit.open}
            setIsOpen={(isOpen) => handleEditClose(isOpen, true)}
            edit={edit}
            reload={reload}
          />
        </SheetComponent>
      )}

      {/* View Assignment Sheet */}
      {view?.visible && (
        <SheetComponent
          {...viewSheetData}
          isOpen={view.visible}
          setIsOpen={(isOpen) => handleViewClose(isOpen)}
          width="568px"
        >
          <ViewAssignedRole
            isOpen={view.visible}
            setIsOpen={(isOpen) => handleViewClose(isOpen, true)}
            data={view.data}
            reload={reload}
            roles={roles}
          />
        </SheetComponent>
      )}
    </>
  );
};

export default AssignedRoleAction;
