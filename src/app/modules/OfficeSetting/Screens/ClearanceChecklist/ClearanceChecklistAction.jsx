// src/app/modules/OfficeSetting/Screens/ClearanceChecklist/ClearanceChecklistAction.jsx
import React, { useState } from "react";
import AlertDialogue from "components/ui/AlertDialogue";
import { deleteRecord } from "app/hooks/general";
import AddClearanceChecklistForm from "./AddClearanceChecklistForm";
import ViewClearanceChecklist from "app/modules/OfficeSetting/Screens/ClearanceChecklist/ViewClearanceChecklist";
import DropdownActionMenu from "components/DropdownActionMenu";
import { renderErrorMessages } from "utils/renderErrors";
import { toast } from "react-toastify";
import { deleteClearanceChecklist } from "app/hooks/officeSetting";

const ClearanceChecklistAction = ({ data, reloadData, DataList = [] }) => {
  const [view, setView] = useState(null);
  const [edit, setEdit] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

  const handleView = () => {
    setView({
      visible: true,
      data: data,
    });
  };

  const handleEdit = () => {
    setEdit({
      open: true,
      data: data,
    });
  };

  const handleDelete = () => {
    setDeleteItem({
      open: true,
      data: data,
    });
  };

  const confirmDelete = async () => {
    try {
     const response = await deleteClearanceChecklist(data?.id);

      console.log("Deleting clearance checklist:", data?.name, response);

      if (typeof reloadData === "function") {
        reloadData(true);
      }
    } catch (error) {
      console.log("ERROR", error);
      toast.error("Failed to delete clearance checklist");
    }
  };

  return (
    <>
      <DropdownActionMenu
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        viewText="View Checklist"
        editText="Edit Checklist"
        deleteText="Delete Checklist"
        menuTooltip="Clearance Checklist Actions"
      />

      {deleteItem?.open && (
        <AlertDialogue
          title="Confirm Delete?"
          description="This action can't be undone. All information associated with this checklist item will be lost."
          isOpen={deleteItem.open}
          setIsOpen={(isOpen) =>
            setDeleteItem((prev) => ({ ...prev, open: isOpen }))
          }
          handleContinue={() => {
            confirmDelete();
            setDeleteItem(null);
          }}
        />
      )}

      {edit?.open && (
        <AddClearanceChecklistForm
          reloadData={() => {
            reloadData(true);
            setEdit(null);
          }}
          id={data.id}
          isOpen={edit?.open}
        />
      )}

      {view?.visible && (
        <ViewClearanceChecklist
          isOpen={view.visible}
          setIsOpen={(isOpen) =>
            setView((prev) => ({ ...prev, visible: isOpen }))
          }
          data={data}
          currentId={data?.id}
          reloadData={reloadData}
          DataList={DataList}
        />
      )}
    </>
  );
};

export default ClearanceChecklistAction;
