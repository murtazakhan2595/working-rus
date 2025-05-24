import React, { useState } from "react";
import AlertDialogue from "components/ui/AlertDialogue";
import { deleteRecord } from "app/hooks/general";
import AddBranchForm from "./AddBranchForm";
import ViewBranch from "app/modules/OfficeSetting/Screens/Branches/ViewBranch";
import DropdownActionMenu from "components/DropdownActionMenu";
import { ViewDetailSheetCardExtension } from "components";

const BranchAction = ({ data, reload, BranchList = [] }) => {
  const [view, setView] = useState(null);
  const [edit, setEdit] = useState(null);
  const [deleteBranch, setDeleteBranch] = useState(null);

  const formSheetData = {
    triggerText: 'Update Branch',
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
      if (typeof reload === 'function') {
        reload();
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
        viewText="View Branch"
        editText="Edit Branch"
        deleteText="Delete Branch"
        menuTooltip="Branch Actions"
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
        <ViewDetailSheetCardExtension
          isOpen={edit?.open}
          setIsOpen={(isOpen) => setEdit((prev) => ({ ...prev, open: isOpen }))}
          title="Update Branch"
          handlePrevious={() => {}}
          handleNext={() => {}}
        >
          <AddBranchForm
            setIsOpen={(isOpen) => setEdit((prev) => ({ ...prev, open: isOpen }))}
            editMode={true}
            reload={reload}
            branchData={edit.data}
            onUpdateSuccess={handleFormUpdate}
          />
        </ViewDetailSheetCardExtension>
      )}

      {view?.visible && (
        <ViewBranch
          isOpen={view.visible}
          setIsOpen={(isOpen) =>
            setView((prev) => ({ ...prev, visible: isOpen }))
          }
          data={view.data}
          reload={reload}
          BranchList={BranchList}
        />
      )}
    </>
  );
};

export default BranchAction;
