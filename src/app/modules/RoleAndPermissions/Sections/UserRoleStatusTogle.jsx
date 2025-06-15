import React, { useState, useCallback } from "react";
import { Switch } from "src/@/components/ui/switch";
import { toast } from "react-toastify";
import { saveUpdateUserRole } from "app/hooks/rolesPermisions";
import { HasAccess } from "utils/PermissionUtils";

const UserRoleStatusTogle = ({ status, data, reloadData }) => {
  const isEditUserRolePermitted = HasAccess("EDIT_USER_ROLE");

  const onCheckedChange = useCallback(
    async (value, data) => {
      try {
        const response = await saveUpdateUserRole(
          { status: value ? "active" : "inactive" },
          data.id
        );

        if (response) {
          toast.success(`User Role Status Updated Successfully!`, {
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
        checked={status === "active"}
        disabled={
          data?.id === 1 ||
          data?.id === 2 ||
          data?.name?.toLowerCase() === "employee" ||
          !isEditUserRolePermitted
        }
        onCheckedChange={(value) => onCheckedChange(value, data)}
      />
    </div>
  );
};


export default UserRoleStatusTogle;
