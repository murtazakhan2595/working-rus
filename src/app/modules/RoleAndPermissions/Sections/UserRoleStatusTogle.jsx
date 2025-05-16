import React, { useState, useCallback } from "react";
import { Switch } from "src/@/components/ui/switch";
import { toast } from "react-toastify";
import { saveUpdateUserRole } from "app/hooks/rolesPermisions";

const UserRoleStatusTogle = ({ status, data, reloadData }) => {
  const onCheckedChange = useCallback(async (value, data) => {
    debugger;
    try {
      // Save role
      const response = await saveUpdateUserRole(
        { status: value ? "active" : "inactive" },
        data.id
      );
      if (response) {
        toast.success(`User Role Status Updated Successfully!`, {
          position: toast.POSITION.TOP_RIGHT,
        });

        // Ensure table is reloaded
        reloadData(true);
      }
    } catch (error) {
      // Show error message
      const errorMessage =
        error?.response?.data?.message ||
        error.message ||
        `Failed to update role status.`;
      toast.error(errorMessage);
    }
  }, []);
  return (
    <div
      onClick={(event) => {
        // Stop the event propagation to prevent onRowClick from being triggered
        event.stopPropagation();
      }}
    >
      <Switch
        id="Status"
        checked={status === "active"}
        onCheckedChange={(value) => {
          // The event is handled by the div, so no need to stop it here
          onCheckedChange(value, data);
        }}
      />
    </div>
  );
};

export default UserRoleStatusTogle;
