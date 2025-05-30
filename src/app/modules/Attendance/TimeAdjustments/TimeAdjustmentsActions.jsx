import React, { useState } from "react";
import AlertDialogue from "components/ui/AlertDialogue";
import { ViewUserRole } from "app/modules/RoleAndPermissions/UserRole";
import { AddUpdateApprovalHierarchy } from "app/modules/ApprovalHierarchy";
import DropdownActionMenu from "components/DropdownActionMenu";
import { deleteRecord } from "app/hooks/general";
import { useNavigate } from "react-router-dom";
import { HasAccess } from "utils/PermissionUtils";

const TimeAdjustmentsActions = ({
  data,
  reloadData = () => {},
  TimeAdjustmentList = [],
}) => {
  const isEditHierarchyPermitted = HasAccess("EDIT_APPROVAL_HIERARCHY");
  const isAddHierarchyPermitted = HasAccess("ADD_APPROVAL_HIERARCHY");
  const isDeleteHierarchyPermitted = HasAccess("Delete_APPROVAL_HIERARCHY");
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
    navigate("/office-settings/approval-hierarchy/hierarchy-detail", {
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
        onView={
          isAddHierarchyPermitted || isEditHierarchyPermitted
            ? handleAddLevels
            : null
        }
        onEdit={isEditHierarchyPermitted ? handleEdit : null}
        onDelete={isDeleteHierarchyPermitted ? handleDelete : null}
        viewText="View Hierarchy Detail"
        editText="Edit Hierarchy"
        deleteText="Delete Hierarchy"
        menuTooltip="Hierarchy Actions"
        additionalOptionsConfig={
          isAddHierarchyPermitted || isEditHierarchyPermitted
            ? [{ action: handleAddLevels, text: "Add Hierarchy Levels" }]
            : []
        }
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
          UserRoleList={TimeAdjustmentList}
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

export default TimeAdjustmentsActions;
