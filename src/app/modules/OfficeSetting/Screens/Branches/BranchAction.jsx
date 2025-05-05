import React, { useState } from "react";
import AlertDialogue from "components/ui/AlertDialogue";
import { deleteRecord } from "app/hooks/general";
import SheetComponent from "components/ui/SheetComponent";
import AddBranchForm from "./AddBranchForm";
import ViewBranch from "app/modules/OfficeSetting/Screens/Branches/ViewBranch";
import DropdownActionMenu from "components/DropdownActionMenu";

const BranchAction = ({ data, reload = () => {} }) => {
  const [view, setView] = useState(null);
  const [OpenDeleteAlert, setOpenDeleteAlert] = useState(false);
  const [EditBranch, setEditBranch] = useState(false);

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
    setEditBranch(true);
  };

  const handleDelete = () => {
    setOpenDeleteAlert(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteRecord(`/branch/${data?.id}`, data?.branch_name);
      reload(true);
    } catch (error) {
      console.error("ERROR", error);
    }
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

      {OpenDeleteAlert && (
        <AlertDialogue
          title="Confirm Delete?"
          description="This action can't be undone. All information associated with this will be lost."
          isOpen={OpenDeleteAlert}
          setIsOpen={(isOpen) => setOpenDeleteAlert(false)}
          handleContinue={() => {
            confirmDelete();
            setOpenDeleteAlert(false);
          }}
        />
      )}

      {EditBranch && (
        <SheetComponent
          {...formSheetData}
          isOpen={EditBranch}
          setIsOpen={setEditBranch}
          width="568px"
        >
          <AddBranchForm
            setIsOpen={setEditBranch}
            editMode={true}
            reload={reload}
            branchData={data}
          />
        </SheetComponent>
      )}

      {view?.visible && (
        <ViewBranch
          isOpen={view.visible}
          setIsOpen={(isOpen) =>
            setView((prev) => ({ ...prev, visible: isOpen }))
          }
          data={view.data}
          reload={reload}
        />
      )}
    </>
  );
};

export default BranchAction;
