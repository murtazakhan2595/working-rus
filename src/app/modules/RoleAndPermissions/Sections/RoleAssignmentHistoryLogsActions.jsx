import React, { useState } from "react";
import AlertDialogue from "components/ui/AlertDialogue";
import { ViewUserRole } from "app/modules/RoleAndPermissions/UserRole";
import DropdownActionMenu from "components/DropdownActionMenu";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { HasAccess } from "utils/PermissionUtils";

const RoleAssignmentHistoryLogsActions = ({ data }) => {
  const navigate = useNavigate();
  const handleView = (e) => {
    e.preventDefault();
    navigate(`/office-settings/role-permission/history-logs`, {
      state: { employee_id: data.id },
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

export default RoleAssignmentHistoryLogsActions;
