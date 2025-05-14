import React, { useState } from "react";
import AlertDialogue from "components/ui/AlertDialogue";
import SheetComponent from "components/ui/SheetComponent";
import DropdownActionMenu from "components/DropdownActionMenu";
import { toast } from "react-toastify";
import AssignRoleForm from "./AssignRoleForm";
import ViewAssignedRole from "./ViewAssignedRole";
import { deleteAssignedRole } from "app/hooks/rolesPermisions";

const AssignedRoleAction = ({ data, reload }) => {
  const [view, setView] = useState(null);
  const [deleteAssignment, setDeleteAssignment] = useState(null);
  const [edit, setEdit] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  // Handle opening the delete confirmation
  const handleDelete = () => {
    setDeleteAssignment({
      open: true,
      data: data,
    });
  };

  // Confirm and execute deletion
  const confirmDelete = async () => {
    if (!deleteAssignment?.data) return;

    setIsDeleting(true);

    try {
      await deleteAssignedRole(deleteAssignment.data.id);

      toast.success(
        `Role assignments for "${deleteAssignment.data.employee?.name}" removed successfully`,
        {
          position: toast.POSITION.TOP_RIGHT,
        }
      );

      // Close the dialog
      setDeleteAssignment(null);

      // Reload the table
      if (typeof reload === "function") {
        reload();
      }
    } catch (error) {
      console.error("Error deleting assigned role:", error);

      // Extract error message from API response
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to remove role assignments";

      toast.error(errorMessage, {
        position: toast.POSITION.TOP_RIGHT,
      });
    } finally {
      setIsDeleting(false);
    }
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

  // Get display text for roles
  const getAssignedRolesText = (roles) => {
    if (!roles || roles.length === 0) return "No roles";
    if (roles.length === 1) return roles[0].name;
    return `${roles[0].name} +${roles.length - 1} more`;
  };

  return (
    <>
      <DropdownActionMenu
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        viewText="View Assignments"
        editText="Edit Assignments"
        deleteText="Remove All Assignments"
        menuTooltip={`Actions for ${data?.employee?.name}`}
        disabled={isDeleting}
      />

      {/* Delete Confirmation Dialog */}
      {deleteAssignment?.open && (
        <AlertDialogue
          title="Confirm Delete?"
          description={
            <div className="space-y-2">
              <p>
                This action will remove all role assignments for{" "}
                <strong>{deleteAssignment.data.employee?.name}</strong>.
              </p>
              <p>They will lose access to the following permissions:</p>
              <ul className="list-disc list-inside pl-4 text-sm text-gray-600">
                {deleteAssignment.data.roles?.map((role) => (
                  <li key={role.id}>{role.name}</li>
                ))}
              </ul>
              <p className="text-red-600 font-medium">
                This action cannot be undone.
              </p>
            </div>
          }
          isOpen={deleteAssignment.open}
          setIsOpen={(isOpen) =>
            setDeleteAssignment((prev) => ({ ...prev, open: isOpen }))
          }
          handleContinue={confirmDelete}
          continueText={isDeleting ? "Removing..." : "Remove Assignments"}
          cancelText="Cancel"
          variant="destructive"
          disabled={isDeleting}
        />
      )}

      {/* Edit Assignment Sheet */}
      {edit?.open && (
        <SheetComponent
          {...formSheetData}
          isOpen={edit.open}
          setIsOpen={(isOpen) => handleEditClose(isOpen)}
          width="800px"
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
          width="700px"
        >
          <ViewAssignedRole
            isOpen={view.visible}
            setIsOpen={(isOpen) => handleViewClose(isOpen, true)}
            data={view.data}
            reload={reload}
          />
        </SheetComponent>
      )}
    </>
  );
};

export default AssignedRoleAction;
