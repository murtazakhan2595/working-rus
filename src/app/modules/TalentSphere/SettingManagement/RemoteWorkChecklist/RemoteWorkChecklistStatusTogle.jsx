import React, { useState, useCallback } from "react";
import { Switch } from "src/@/components/ui/switch";
import { toast } from "react-toastify";
import { saveUpdateRemoteWorkChecklist } from "app/hooks/talentSphere";
import { HasAccess } from "utils/PermissionUtils";

const RemoteWorkChecklistStatusTogle = ({ status, data, reloadData }) => {
  const isEditPermitted = HasAccess("EDIT_TS_REMOTE_WORK_CHECKLIST");

  const onCheckedChange = useCallback(
    async (value, data) => {
      try {
        const response = await saveUpdateRemoteWorkChecklist(
          { status: value ? 'available' : 'unavailable' },
          data.id
        );

        if (response) {
          toast.success(`Remote Work Checklist Status Updated Successfully!`, {
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
        checked={status === "available"}
        disabled={!isEditPermitted}
        onCheckedChange={(value) => onCheckedChange(value, data)}
      />
    </div>
  );
};


export default RemoteWorkChecklistStatusTogle;
