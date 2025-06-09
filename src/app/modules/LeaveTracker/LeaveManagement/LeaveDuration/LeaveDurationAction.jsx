import React, { useState } from "react";
import SheetComponent from "components/ui/SheetComponent";
import DropdownActionMenu from "components/DropdownActionMenu";
import AlertDialogue from "components/ui/AlertDialogue";
import {
  ViewLeaveDuration,
  AddUpdateLeaveDuration,
} from "app/modules/LeaveTracker";
import { toast } from "react-toastify";
import { deleteLeaveDuration } from "app/hooks/leaveTracker";

const LeaveDurationAction = ({ data, reload, leaveDurationList = [] }) => {
  const [view, setView] = useState(null);
  const [edit, setEdit] = useState(null);
  const [deleteDurationState, setDeleteDurationState] = useState(null);

  const formSheetData = {
    triggerText: null,
    title: "Update Leave Duration",
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

  // Handle delete
  const handleDelete = () => {
    setDeleteDurationState({
      open: true,
      data: data,
    });
  };

  // Handle edit form close with optional reload
  const handleEditClose = (isOpen, updated = false) => {
    setEdit((prev) => ({ ...prev, open: isOpen }));

    // If the duration was updated, reload the table
    if (updated && typeof reload === "function") {
      reload();
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteLeaveDuration(deleteDurationState?.data?.id);

      setDeleteDurationState(null);

      // Ensure table is reloaded by calling reload function
      if (typeof reload === "function") {
        reload();
      }

      toast.success("Duration deleted successfully", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (error) {
      console.error("ERROR", error);
      toast.error("Failed to delete duration", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  return (
    <>
      <DropdownActionMenu
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        viewText="View Duration"
        editText="Edit Duration"
        deleteText="Delete Duration"
        menuTooltip="Duration Actions"
      />

      {deleteDurationState?.open && (
        <AlertDialogue
          title="Confirm Delete?"
          description={`This action can't be undone. All information associated with duration "${deleteDurationState?.data?.duration_name}" will be lost.`}
          isOpen={deleteDurationState.open}
          setIsOpen={(isOpen) =>
            setDeleteDurationState((prev) => ({ ...prev, open: isOpen }))
          }
          handleContinue={confirmDelete}
        />
      )}

      {/* Edit Duration Sheet */}
      {edit?.open && (
        <SheetComponent
          {...formSheetData}
          isOpen={edit.open}
          setIsOpen={(isOpen) => handleEditClose(isOpen)}
          width="568px"
        >
          <AddUpdateLeaveDuration
            isOpen={edit.open}
            setIsOpen={(isOpen) => handleEditClose(isOpen, true)}
            data={edit.data}
            reload={reload}
          />
        </SheetComponent>
      )}

      {/* View Duration - Direct component usage like ViewUserRole */}
      {view?.visible && (
        <ViewLeaveDuration
          isOpen={view.visible}
          setIsOpen={(isOpen) =>
            setView((prev) => ({ ...prev, visible: isOpen }))
          }
          data={view.data}
          reload={reload}
          leaveDurationList={leaveDurationList}
        />
      )}
    </>
  );
};

export default LeaveDurationAction;
