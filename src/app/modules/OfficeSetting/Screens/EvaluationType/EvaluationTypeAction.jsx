import React, { useState } from "react";
import AlertDialogue from "components/ui/AlertDialogue";
import { deleteRecord } from "app/hooks/general";
import AddEvaluationTypeForm from "./AddEvaluationTypeForm";
import ViewEvaluationType from "app/modules/OfficeSetting/Screens/EvaluationType/ViewEvaluationType";
import DropdownActionMenu from "components/DropdownActionMenu";
import { useOfficeSettingPermissions } from "../../hooks/useOfficeSettingPermissions";

const EvaluationTypeAction = ({ data, reloadData, DataList = [] }) => {
  const [view, setView] = useState(null);
  const [edit, setEdit] = useState(null);
  const [deleteBranch, setDeleteBranch] = useState(null);
  const permissions = useOfficeSettingPermissions();

  const formSheetData = {
    triggerText: "Update Branch",
    title: "Update Branch",
    description: null,
    footer: null,
  };

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
      await deleteRecord(`/evaluation-types/${data?.id}/`, data?.name);
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
        viewText="View Evaluation Type"
        editText="Edit Evaluation Type"
        deleteText="Delete Evaluation Type"
        menuTooltip="Grace Evaluation Type"
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
        <AddEvaluationTypeForm
          reloadData={() => {
            reloadData(true);
            setEdit(null);
          }}
          id={data.id}
          isOpen={edit?.open}
        />
      )}

      {view?.visible && (
        <ViewEvaluationType
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

export default EvaluationTypeAction;
