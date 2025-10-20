import React, { useState, useCallback } from "react";
import { Switch } from "src/@/components/ui/switch";
import { toast } from "react-toastify";
import { saveUpdateDemographicForm } from "app/hooks/talentSphere";
import { HasAccess } from "utils/PermissionUtils";

const DemographicsFormStatusTogle = ({ status, data, reloadData }) => {
  const isEditPermitted = HasAccess("EDIT_INTERVIEW_TYPE");

  const onCheckedChange = useCallback(
    async (value, data) => {
      try {
        const response = await saveUpdateDemographicForm(
          { is_active: value },
          data.id
        );

        if (response) {
          toast.success(`Demograpghic Form Status Updated Successfully!`, {
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


export default DemographicsFormStatusTogle;
