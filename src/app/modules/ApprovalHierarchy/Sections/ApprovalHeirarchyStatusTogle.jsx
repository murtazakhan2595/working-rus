import React, { useState, useCallback } from "react";
import { Switch } from "src/@/components/ui/switch";
import { toast } from "react-toastify";
import { saveUpdateApprovalHierarchy } from "app/hooks/approvalHierarchy";
import { HasAccess } from "utils/PermissionUtils";

const ApprovalHeirarchyStatusTogle = ({ status, data, reloadData }) => {
  const isEditHierarchyPermitted = HasAccess("EDIT_APPROVAL_HIERARCHY");

  const onCheckedChange = useCallback(
    async (value, data) => {
      try {
        const response = await saveUpdateApprovalHierarchy(
          { status: value ? true : false },
          data.id
        );

        if (response) {
          toast.success(`Approval Hierarchy Status Updated Successfully!`, {
            position: toast.POSITION.TOP_RIGHT,
          });
          reloadData(true);
        }
      } catch (error) {
        const errorMessage =
          error?.response?.data?.message ||
          error.message ||
          `Failed to update role status.`;
        toast.error(errorMessage);
      }
    },
    [reloadData] // ensure dependencies are listed
  );

  return (
    <div
      onClick={(event) => {
        event.stopPropagation();
      }}
    >
      <Switch
        id="Status"
        checked={status}
        disabled={!isEditHierarchyPermitted}
        onCheckedChange={(value) => onCheckedChange(value, data)}
      />
    </div>
  );
};

export default ApprovalHeirarchyStatusTogle;
