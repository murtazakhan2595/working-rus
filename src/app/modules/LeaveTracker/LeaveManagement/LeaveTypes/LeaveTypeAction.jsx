import React, { useState } from "react";
import SheetComponent from "components/ui/SheetComponent";
import DropdownActionMenu from "components/DropdownActionMenu";
import AlertDialogue from "components/ui/AlertDialogue";
import AddUpdateLeaveType from "./AddUpdateLeaveType";
import ViewLeaveType from "./ViewLeaveType";
import { toast } from "react-toastify";
import { deleteLeaveType } from "app/hooks/leaveTracker";

const LeaveTypeAction = ({ data, reload, leaveTypeList = [] }) => {
  const [view, setView] = useState(null);
  const [edit, setEdit] = useState(null);
  const [deleteTypeState, setDeleteTypeState] = useState(null);

  const formSheetData = {
    triggerText: null,
    title: "Update Leave Type",
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
    setDeleteTypeState({
      open: true,
      data: data,
    });
  };

  // Handle edit form close with optional reload
  const handleEditClose = (isOpen, updated = false) => {
    setEdit((prev) => ({ ...prev, open: isOpen }));

    // If the type was updated, reload the table
    if (updated && typeof reload === "function") {
      reload();
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteLeaveType(deleteTypeState?.data?.id);

      setDeleteTypeState(null);

      // Ensure table is reloaded by calling reload function
      if (typeof reload === "function") {
        reload();
      }

      toast.success("Leave type deleted successfully", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (error) {
      console.error("ERROR", error);
      toast.error("Failed to delete leave type", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const ShowEdit = data.id !== 1;
  const DeleteRecord = data.id !== 1;

  return (
    <>
      <DropdownActionMenu
        onView={handleView}
        onEdit={ShowEdit ? handleEdit : null}
        onDelete={DeleteRecord ? handleDelete : null}
        viewText="View Leave Type"
        editText="Edit Leave Type"
        deleteText="Delete Leave Type"
        menuTooltip="Leave Type Actions"
      />

      {deleteTypeState?.open && (
        <AlertDialogue
          title="Confirm Delete?"
          description={`This action can't be undone. All information associated with leave type "${deleteTypeState?.data?.name}" will be lost.`}
          isOpen={deleteTypeState.open}
          setIsOpen={(isOpen) =>
            setDeleteTypeState((prev) => ({ ...prev, open: isOpen }))
          }
          handleContinue={confirmDelete}
        />
      )}

      {/* Edit Leave Type Sheet */}
      {edit?.open && (
        <AddUpdateLeaveType
          isOpen={edit.open}
          setIsOpen={(isOpen) => handleEditClose(isOpen, true)}
          data={edit.data}
          reload={reload}
        />
      )}

      {/* View Leave Type - Direct component usage like ViewUserRole */}
      {view?.visible && (
        <ViewLeaveType
          isOpen={view.visible}
          setIsOpen={(isOpen) =>
            setView((prev) => ({ ...prev, visible: isOpen }))
          }
          data={view.data}
          reload={reload}
          leaveTypeList={leaveTypeList}
        />
      )}
    </>
  );
};

export default LeaveTypeAction;
