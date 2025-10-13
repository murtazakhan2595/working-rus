import React, { useState, useCallback } from "react";
import { Switch } from "src/@/components/ui/switch";
import { toast } from "react-toastify";
import { saveUpdateBlacklistReason } from "app/hooks/talentSphere";
import { HasAccess } from "utils/PermissionUtils";

const BlacklistReasonStatusTogle = ({ status, data, reloadData }) => {
  const isEditPermitted = HasAccess("EDIT_BLACKLIST_REASON");

  const onCheckedChange = useCallback(
    async (value, data) => {
      try {
        const response = await saveUpdateBlacklistReason(
          { is_active: value ? 'active' : 'inactive' },
          data.id
        );

        if (response) {
          toast.success(`BlacklistReason Status Updated Successfully!`, {
            position: toast.POSITION.TOP_RIGHT,
          });
          reloadData(true);
        }
      } catch (error) {
        console.error(error);
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
        disabled={!isEditPermitted}
        onCheckedChange={(value) => onCheckedChange(value, data)}
      />
    </div>
  );
};


export default BlacklistReasonStatusTogle;
