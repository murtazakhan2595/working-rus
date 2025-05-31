import React, { useState } from "react";
import AlertDialogue from "components/ui/AlertDialogue";
import { deleteRecord } from "app/hooks/general";
import AddGraceTimeForm from "./AddGraceTimeForm";
import ViewBranch from "app/modules/OfficeSetting/Screens/Branches/ViewBranch";
import DropdownActionMenu from "components/DropdownActionMenu";
import { ViewDetailSheetCardExtension } from "components";

const GraceTimeAction = ({ data, reloadData, DataList = [] }) => {
  const [view, setView] = useState(null);
  const [edit, setEdit] = useState(null);
  const [deleteBranch, setDeleteBranch] = useState(null);

  const formSheetData = {
    triggerText: "Update Branch",
    title: "Update Branch",
    description: null,
    footer: null,
  };

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
    setDeleteBranch({
      open: true,
      data: data,
    });
  };

  const confirmDelete = async () => {
    try {
      await deleteRecord(`/branch/${data?.id}`, data?.branch_name);
      if (typeof reloadData === "function") {
        reloadData();
      }
    } catch (error) {
      console.log("ERROR", error);
    }
  };

  const handleFormUpdate = async (formData) => {
    console.log("Branch updated with data:", formData);
    return true;
  };

  return (
    <>
      <DropdownActionMenu
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        viewText="View Grace Time"
        editText="Edit Grace Time"
        deleteText="Delete Grace Time"
        menuTooltip="Grace Time Actions"
      />

      {deleteBranch?.open && (
        <AlertDialogue
          title="Confirm Delete?"
          description="This action can't be undone. All information associated with this will be lost."
          isOpen={deleteBranch.open}
          setIsOpen={(isOpen) =>
            setDeleteBranch((prev) => ({ ...prev, open: isOpen }))
          }
          handleContinue={() => {
            confirmDelete();
            setDeleteBranch(null);
          }}
        />
      )}

      {edit?.open && (
        <AddGraceTimeForm
          reloadData={() => {
            reloadData(true);
            setEdit(null);
          }}
          id={data.id}
          IsOpen={edit?.open}
        />
      )}

      {view?.visible && (
        <ViewBranch
          isOpen={view.visible}
          setIsOpen={(isOpen) =>
            setView((prev) => ({ ...prev, visible: isOpen }))
          }
          data={view.data}
          reloadData={reloadData}
          DataList={DataList}
        />
      )}
    </>
  );
};

export default GraceTimeAction;
