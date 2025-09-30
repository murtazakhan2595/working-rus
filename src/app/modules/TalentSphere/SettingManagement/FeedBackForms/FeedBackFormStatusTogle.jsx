import React, { useState, useCallback } from "react";
import { Switch } from "src/@/components/ui/switch";
import { toast } from "react-toastify";
import { saveUpdateFeedBackForm } from "app/hooks/talentSphere";
import { HasAccess } from "utils/PermissionUtils";

const FeedBackFormStatusTogle = ({ status, data, reloadData }) => {
  const isEditPermitted = HasAccess("EDIT_TS_BENEFITS");

  const onCheckedChange = useCallback(
    async (value, data) => {
      try {
        const response = await saveUpdateFeedBackForm(
          { status: value ? 'ACTIVE' : 'INACTIVE' },
          data.id
        );

        if (response) {
          toast.success(`Feedback Form Status Updated Successfully!`, {
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
        checked={status === "ACTIVE"}
        disabled={!isEditPermitted}
        onCheckedChange={(value) => onCheckedChange(value, data)}
      />
    </div>
  );
};


export default FeedBackFormStatusTogle;
