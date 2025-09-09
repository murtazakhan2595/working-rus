import React, { useState } from "react";
import AlertDialogue from "components/ui/AlertDialogue";
import { deleteRecord } from "app/hooks/general";
import AddRatingScaleSetupForm from "./AddRatingScaleSetupForm";
import ViewRatingScaleSetup from "app/modules/OfficeSetting/Screens/RatingScaleSetup/ViewRatingScaleSetup";
import DropdownActionMenu from "components/DropdownActionMenu";
import { useOfficeSettingPermissions } from "../../hooks/useOfficeSettingPermissions";

const RatingScaleSetupAction = ({ data, reloadData, DataList = [] }) => {
  const [view, setView] = useState(null);
  const [edit, setEdit] = useState(null);
  const [deleteBranch, setDeleteBranch] = useState(null);
  const permissions = useOfficeSettingPermissions();

  const handleView = () => {
    setView({
      visible: true,
      data: data,
    });
  };

  const handleEdit = () => {
    setEdit({
      open: true,
      data: data,
    });
  };

  const handleDelete = () => {
    setDeleteBranch({
      open: true,
      data: data,
    });
  };

  const confirmDelete = async () => {
    try {
      await deleteRecord(`/RatingScale/${data?.id}/`, data?.name);
      if (typeof reloadData === "function") {
        reloadData(true);
      }
    } catch (error) {
      console.log("ERROR", error);
    }
  };

  const handleFormUpdate = async (formData) => {
    console.log("Branch updated with data:", formData);
    return true;
  };

  return (
    <>
      <DropdownActionMenu
        onView={permissions.graceTime.canView ? handleView : null}
        onEdit={permissions.graceTime.canUpdate ? handleEdit : null}
        onDelete={permissions.graceTime.canDelete ? handleDelete : null}
        viewText="View Rating Scale"
        editText="Edit Rating Scale"
        deleteText="Delete Rating Scale"
        menuTooltip="Rating Scale"
      />

      {deleteBranch?.open && (
        <AlertDialogue
          title="Confirm Delete?"
          description="This action can't be undone. All information associated with this will be lost."
          isOpen={deleteBranch.open}
          setIsOpen={(isOpen) =>
            setDeleteBranch((prev) => ({ ...prev, open: isOpen }))
          }
          handleContinue={() => {
            confirmDelete();
            setDeleteBranch(null);
          }}
        />
      )}

      {edit?.open && (
        <AddRatingScaleSetupForm
          reloadData={() => {
            reloadData(true);
            setEdit(null);
          }}
          id={data.id}
          isOpen={edit?.open}
        />
      )}

      {view?.visible && (
        <ViewRatingScaleSetup
          isOpen={view.visible}
          setIsOpen={(isOpen) =>
            setView((prev) => ({ ...prev, visible: isOpen }))
          }
          data={data}
          currentId={data?.id}
          reloadData={reloadData}
          DataList={DataList}
        />
      )}
    </>
  );
};

export default RatingScaleSetupAction;
