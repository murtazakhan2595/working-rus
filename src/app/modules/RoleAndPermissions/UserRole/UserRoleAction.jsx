import React, { useState } from "react";
import AlertDialogue from "components/ui/AlertDialogue";
import { ViewUserRole } from "app/modules/RoleAndPermissions/UserRole";
import DropdownActionMenu from "components/DropdownActionMenu";
import { toast } from "react-toastify";
import { deleteRole } from "app/hooks/rolesPermisions";
import { useNavigate } from "react-router-dom";

const UserRoleAction = ({ data, reload }) => {
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
      console.log("Deleting role:", deleteRoleState?.data?.id);
      await deleteRole(deleteRoleState?.data?.id);

      toast.success(
        `Role "${deleteRoleState?.data?.name}" deleted successfully`,
        {
          position: toast.POSITION.TOP_RIGHT,
        }
      );

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
        onEdit={handleEdit}
        onDelete={handleDelete}
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
        />
      )}
    </>
  );
};

export default UserRoleAction;
