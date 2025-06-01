import React, { useState } from "react";
import AlertDialogue from "components/ui/AlertDialogue";
import { ViewUserRole } from "app/modules/RoleAndPermissions/UserRole";
import {
  AddUpdateApprovalHierarchy,
  AddUpdateDelegateLevels,
} from "app/modules/ApprovalHierarchy";
import DropdownActionMenu from "components/DropdownActionMenu";
import { toast } from "react-toastify";
import { deleteRecord } from "app/hooks/general";
import { useNavigate } from "react-router-dom";
import { HasAccess } from "utils/PermissionUtils";

const ApprovalHierarchyLevelActions = ({
  data,
  reloadData = () => {},
  ApprovalHierarchyList = [],
}) => {
  const isAddDelegatePermitted = HasAccess("ADD_LEVEL_DELEGATE");
  const [view, setView] = useState(null);
  const [deleteRoleState, setDeleteRoleState] = useState(null);
  const [openEditForm, setOpenEditForm] = useState(false);
  const navigate = useNavigate();

  const handleView = () => {
    setView({
      visible: true,
      data: data,
    });
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
      await deleteRecord(
        `/levels/${data.id}`,
        `Level No ${data.level_number || ""}`
      );
      setDeleteRoleState(null);
      // Ensure table is reloaded by calling reload function
      reloadData(true);
    } catch (error) {
      console.error("ERROR", error);
    }
  };
  if(!isAddDelegatePermitted) return null;

  return (
    <>
      <DropdownActionMenu
        onEdit={isAddDelegatePermitted ? handleEdit : null}
        // onDelete={isEditUserRolePermitted ? handleDelete : null}
        editText="Delegate Level"
        // deleteText="Delete Level"
        menuTooltip="Hierarchy Level Actions"
      />

      {deleteRoleState?.open && (
        <AlertDialogue
          title="Confirm Delete?"
          description={`This action can't be undone. All information associated with this level will be lost.`}
          isOpen={deleteRoleState.open}
          setIsOpen={(isOpen) =>
            setDeleteRoleState((prev) => ({ ...prev, open: isOpen }))
          }
          handleContinue={confirmDelete}
        />
      )}

      {view?.visible && (
        <ViewUserRole
          isOpen={view.visible}
          setIsOpen={(isOpen) =>
            setView((prev) => ({ ...prev, visible: isOpen }))
          }
          data={view.data}
          reload={reloadData}
          UserRoleList={ApprovalHierarchyList}
          roleID={view?.data?.id}
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
          level_id={data.id}
        />
      )}
    </>
  );
};

export default ApprovalHierarchyLevelActions;
