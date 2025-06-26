import React, { useState } from "react";
import SheetComponent from "components/ui/SheetComponent";
import DropdownActionMenu from "components/DropdownActionMenu";
import AlertDialogue from "components/ui/AlertDialogue";
import { toast } from "react-toastify";
import ViewTerminationReason from "./ViewTerminationReason";
import { AddUpdateTerminationReasons } from ".";
import { deleteTerminationReason } from "app/hooks/employeeExitAndClearance";

const TerminationReasonsAction = ({ data, reload, dataList = [] }) => {
  const [view, setView] = useState(null);
  const [edit, setEdit] = useState(null);
  const [deleteReasonState, setDeleteReasonState] = useState(null);

  const formSheetData = {
    triggerText: null,
    title: "Update Termination Reason",
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
    setDeleteReasonState({
      open: true,
      data: data,
    });
  };

  // Handle edit form close with optional reload
  const handleEditClose = (isOpen, updated = false) => {
    setEdit((prev) => ({ ...prev, open: isOpen }));

    // If the termination reason was updated, reload the table
    if (updated && typeof reload === "function") {
      reload(true); // Pass true to indicate it's a forced reload
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteTerminationReason(deleteReasonState?.data?.id);

      // Close the delete dialog first
      setDeleteReasonState(null);

      // Show success message
      toast.success("Termination reason deleted successfully", {
        position: toast.POSITION.TOP_RIGHT,
      });

      // Reload the table - this is the key fix
      if (typeof reload === "function") {
        reload(true); // Pass true to indicate it's a forced reload
      }
    } catch (error) {
      console.error("ERROR", error);
      toast.error("Failed to delete termination reason", {
        position: toast.POSITION.TOP_RIGHT,
      });

      // Close the delete dialog even on error
      setDeleteReasonState(null);
    }
  };

  // Handle view close with reload
  const handleViewClose = (isOpen) => {
    setView((prev) => ({ ...prev, visible: isOpen }));

    // Reload data when view is closed (in case of edits/deletes from view)
    if (!isOpen && typeof reload === "function") {
      reload(true);
    }
  };

  return (
    <>
      <DropdownActionMenu
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        viewText="View Termination Reason"
        editText="Edit Termination Reason"
        deleteText="Delete Termination Reason"
        menuTooltip="Termination Reason Actions"
      />

      {deleteReasonState?.open && (
        <AlertDialogue
          title="Confirm Delete?"
          description={`This action can't be undone. All information associated with termination reason "${deleteReasonState?.data?.name}" will be lost.`}
          isOpen={deleteReasonState.open}
          setIsOpen={(isOpen) =>
            setDeleteReasonState((prev) => ({ ...prev, open: isOpen }))
          }
          handleContinue={confirmDelete}
        />
      )}

      {edit?.open && (
        <SheetComponent
          {...formSheetData}
          isOpen={edit.open}
          setIsOpen={(isOpen) => handleEditClose(isOpen)}
          width="568px"
        >
          <AddUpdateTerminationReasons
            isOpen={edit.open}
            setIsOpen={(isOpen) => handleEditClose(isOpen, true)}
            data={edit.data}
            reload={() => reload(true)} // Ensure reload is called with force flag
          />
        </SheetComponent>
      )}

      {view?.visible && (
        <ViewTerminationReason
          isOpen={view.visible}
          setIsOpen={handleViewClose}
          data={view.data}
          reload={() => reload(true)} // Ensure reload is called with force flag
          dataList={dataList}
        />
      )}
    </>
  );
};

export default TerminationReasonsAction;
