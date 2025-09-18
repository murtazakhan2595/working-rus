import React, { useState } from "react";
import AlertDialogue from "components/ui/AlertDialogue";
import { ViewUserRole } from "app/modules/RoleAndPermissions/UserRole";
import DropdownActionMenu from "components/DropdownActionMenu";
import { toast } from "react-toastify";
import { deleteRole } from "app/hooks/general";
import { useNavigate } from "react-router-dom";
import { HasAccess } from "utils/PermissionUtils";

const UserRoleAction = ({ data, reload, UserRoleList = [] }) => {
  const isEditUserRolePermitted = HasAccess("EDIT_USER_ROLE");
  const [view, setView] = useState(null);
  const [deleteRoleState, setDeleteRoleState] = useState(null);
  const navigate = useNavigate();

  const handleView = () => {
    setView({
      visible: true,
      data: data,
    });
  };

  const handleEdit = (e) => {
    e.preventDefault();
    navigate(`/office-settings/role-permission/user-role/edit`, {
      state: { id: data.id },
    });
  };

  const handleDelete = () => {
    setDeleteRoleState({
      open: true,
      data: data,
    });
  };

  const confirmDelete = async () => {
    try {
      await deleteRole(deleteRoleState?.data?.id, deleteRoleState?.data?.name);

      setDeleteRoleState(null);

      // Ensure table is reloaded by calling reload function
      if (typeof reload === "function") {
        reload();
      }
    } catch (error) {
      console.error("ERROR", error);
      toast.error("Failed to delete role", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  return (
    <>
      <DropdownActionMenu
        onView={handleView}
        onEdit={isEditUserRolePermitted && data?.id !== 1 ? handleEdit : null}
        onDelete={
          isEditUserRolePermitted &&
          data?.id !== 1 &&
          data?.id !== 2 &&
          data?.name?.toLowerCase() !== "employee"
            ? handleDelete
            : null
        }
        viewText="View Role"
        editText="Edit Role"
        deleteText="Delete Role"
        menuTooltip="Role Actions"
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
          reload={reload}
          UserRoleList={UserRoleList}
          roleID={view?.data?.id}
        />
      )}
    </>
  );
};

export default UserRoleAction;
