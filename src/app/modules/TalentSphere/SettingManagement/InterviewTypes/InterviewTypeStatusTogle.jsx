import React, { useState, useCallback } from "react";
import { Switch } from "src/@/components/ui/switch";
import { toast } from "react-toastify";
import { saveUpdateInterviewType } from "app/hooks/talentSphere";
import { HasAccess } from "utils/PermissionUtils";

const InterviewTypeStatusTogle = ({ status, data, reloadData }) => {
  const isEditPermitted = HasAccess("EDIT_INTERVIEW_TYPE");

  const onCheckedChange = useCallback(
    async (value, data) => {
      try {
        const response = await saveUpdateInterviewType(
          { status: value ? 'active' : 'inactive' },
          data.id
        );

        if (response) {
          toast.success(`InterviewType Status Updated Successfully!`, {
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
        checked={status === "active"}
        disabled={!isEditPermitted}
        onCheckedChange={(value) => onCheckedChange(value, data)}
      />
    </div>
  );
};


export default InterviewTypeStatusTogle;
