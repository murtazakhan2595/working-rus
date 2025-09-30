import React, { useState, useCallback } from "react";
import { Switch } from "src/@/components/ui/switch";
import { toast } from "react-toastify";
import { saveUpdateOfferLetterTemplate } from "app/hooks/talentSphere";
import { HasAccess } from "utils/PermissionUtils";

const OfferLetterTemplateStatusTogle = ({ is_active, data, reloadData }) => {
  const isEditPermitted = HasAccess("EDIT_TS_BENEFITS");

  const onCheckedChange = useCallback(
    async (value, data) => {
      try {
        const response = await saveUpdateOfferLetterTemplate(
          { is_active: value },
          data.id
        );

        if (response) {
          toast.success(`Offer Letter Template Status Updated Successfully!`, {
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
        checked={is_active}
        disabled={!isEditPermitted}
        onCheckedChange={(value) => onCheckedChange(value, data)}
      />
    </div>
  );
};


export default OfferLetterTemplateStatusTogle;
