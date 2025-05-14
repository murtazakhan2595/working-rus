import React, { useState } from "react";
import AlertDialogue from "components/ui/AlertDialogue";
import SheetComponent from "components/ui/SheetComponent";
import {
  ViewUserRole,
  AddUpdateUserRoleForm,
} from "app/modules/RoleAndPermissions/UserRole";
import DropdownActionMenu from "components/DropdownActionMenu";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const UserRoleAction = ({ data, reload }) => {
  const [view, setView] = useState(null);
  const [deleteRole, setDeleteRole] = useState(null);
  const [edit, setEdit] = useState(null);
  const navigate = useNavigate();

  const formSheetData = {
    triggerText: null,
    title: "Update Role",
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
    navigate("/office-settings/role-managment/user-role/edit", {
      state: {
        id: data.id,
      },
    });
    setEdit({
      open: true,
      data: data,
    });
  };

  const handleDelete = () => {
    setDeleteRole({
      open: true,
      data: data,
    });
  };

  const confirmDelete = async () => {
    try {
      // Mock deletion for now
      toast.success(`Role "${deleteRole?.data?.name}" deleted successfully`, {
        position: toast.POSITION.TOP_RIGHT,
      });

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

      {deleteRole?.open && (
        <AlertDialogue
          title="Confirm Delete?"
          description="This action can't be undone. All information associated with this will be lost."
          isOpen={deleteRole.open}
          setIsOpen={(isOpen) =>
            setDeleteRole((prev) => ({ ...prev, open: isOpen }))
          }
          handleContinue={() => {
            confirmDelete();
            setDeleteRole(null);
          }}
        />
      )}

      {edit?.open && (
        <SheetComponent
          {...formSheetData}
          isOpen={edit?.open}
          setIsOpen={(isOpen) => setEdit((prev) => ({ ...prev, open: isOpen }))}
          width="700px"
        >
          <AddUpdateUserRoleForm
            isOpen={edit.open}
            setIsOpen={(isOpen) =>
              setEdit((prev) => ({ ...prev, open: isOpen }))
            }
            edit={edit}
            reload={reload}
          />
        </SheetComponent>
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
