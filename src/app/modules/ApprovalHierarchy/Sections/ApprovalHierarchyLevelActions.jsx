import React, { useState } from "react";
import AlertDialogue from "components/ui/AlertDialogue";
import { ViewUserRole } from "app/modules/RoleAndPermissions/UserRole";
import { AddUpdateApprovalHierarchy } from "app/modules/ApprovalHierarchy";
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
  const isEditUserRolePermitted = HasAccess("EDIT_USER_ROLE");
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
  const handleAddLevels = () => {
    navigate("/office-settings/approval-hierarchy/add-levels", {
      state: { GOTO_URL: "/office-settings/approval-hierarchy", id: data.id },
    });
  };

  const confirmDelete = async () => {
    try {
      await deleteRecord(`/hierarchies/${data.id}`, data?.name);
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
        onEdit={isEditUserRolePermitted ? handleEdit : null}
        onDelete={isEditUserRolePermitted ? handleDelete : null}
        editText="Edit Hierarchy"
        deleteText="Delete Hierarchy"
        menuTooltip="Hierarchy Actions"
      />

      {deleteRoleState?.open && (
        <AlertDialogue
          title="Confirm Delete?"
          description={`This action can't be undone. All information associated with role "${deleteRoleState?.data?.name}" will be lost.`}
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
        <AddUpdateApprovalHierarchy
          isOpen={openEditForm}
          setReloadData={reloadData}
          id={data.id}
        />
      )}
    </>
  );
};

export default ApprovalHierarchyLevelActions;
