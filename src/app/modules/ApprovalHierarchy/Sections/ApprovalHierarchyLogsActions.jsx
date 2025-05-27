import React, { useState } from "react";
import AlertDialogue from "components/ui/AlertDialogue";
import { ViewUserRole } from "app/modules/RoleAndPermissions/UserRole";
import DropdownActionMenu from "components/DropdownActionMenu";
import { toast } from "react-toastify";
import { deleteRole } from "app/hooks/rolesPermisions";
import { useNavigate } from "react-router-dom";
import { HasAccess } from "utils/PermissionUtils";

const ApprovalHierarchyLogsActions = ({ data }) => {
  const navigate = useNavigate();
  const handleView = (e) => {
    e.preventDefault();
    navigate(`/office-settings/approval-hierarchy/history-logs`, {
      state: {
        id: data.id,
        GOTO_URL: "/office-settings/approval-hierarchy/history",
      },
    });
  };

  return (
    <>
      <DropdownActionMenu
        onView={handleView}
        viewText="View History"
        menuTooltip="History Actions"
      />
    </>
  );
};

export default ApprovalHierarchyLogsActions;
