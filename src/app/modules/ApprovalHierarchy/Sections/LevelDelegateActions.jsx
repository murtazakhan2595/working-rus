import React, { useState } from "react";
import AlertDialogue from "components/ui/AlertDialogue";
import {
  DelegateDetails,
  AddUpdateDelegateLevels,
} from "app/modules/ApprovalHierarchy";
import DropdownActionMenu from "components/DropdownActionMenu";
import { deleteRecord } from "app/hooks/general";
import { useNavigate } from "react-router-dom";
import { HasAccess } from "utils/PermissionUtils";

const LevelDelegateActions = ({
  data,
  reloadData = () => {},
  LevelDelegateList = [],
}) => {
  const isEditUserRolePermitted = HasAccess("EDIT_USER_ROLE");
  const [view, setView] = useState(null);
  const [deleteRoleState, setDeleteRoleState] = useState(null);
  const [openEditForm, setOpenEditForm] = useState(false);
  const navigate = useNavigate();

  const handleView = () => {
    setView(true);
  };

  const handleEdit = () => {
    setOpenEditForm(true);
  };

  const handleDelete = () => {
    setDeleteRoleState({
      open: true,
      data: data,
    });
  };

  const confirmDelete = async () => {
    try {
      await deleteRecord(`/delegations/${data.id}`, "Delegate");
      setDeleteRoleState(null);
      // Ensure table is reloaded by calling reload function
      reloadData(true);
    } catch (error) {
      console.error("ERROR", error);
    }
  };

  return (
    <>
      <DropdownActionMenu
        // onView={handleView}
        onEdit={isEditUserRolePermitted ? handleEdit : null}
        onDelete={isEditUserRolePermitted ? handleDelete : null}
        // viewText="View Delegate"
        editText="Edit Delegate"
        deleteText="Delete Delegate"
        menuTooltip="Delegates Actions"
      />

      {deleteRoleState?.open && (
        <AlertDialogue
          title="Confirm Delete?"
          description={`This action can't be undone. All information associated with delegate will be lost.`}
          isOpen={deleteRoleState.open}
          setIsOpen={(isOpen) =>
            setDeleteRoleState((prev) => ({ ...prev, open: isOpen }))
          }
          handleContinue={confirmDelete}
        />
      )}

      {view && (
        <DelegateDetails
          isOpen={view}
          setIsOpen={() => {
            setView(false);
          }}
          current_id={data.id}
          reloadData={reloadData}
          LevelDelegateList={LevelDelegateList}
        />
      )}
      {openEditForm && (
        <AddUpdateDelegateLevels
          isOpen={openEditForm}
          reloadData={() => {
            reloadData(true);
            setOpenEditForm(false);
          }}
          setIsOpen={() => {
            setOpenEditForm(false);
          }}
          id={data.id}
        />
      )}
    </>
  );
};

export default LevelDelegateActions;
