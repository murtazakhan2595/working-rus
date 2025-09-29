import React, { useState } from "react";
import AlertDialogue from "components/ui/AlertDialogue";
import { ViewManpowerPlanning, AddUpdateManpower } from "app/modules/TalentSphere";
import DropdownActionMenu from "components/DropdownActionMenu";
import { deleteRecord } from "app/hooks/general";
import { HasAccess } from "utils/PermissionUtils";

const ManpowerPlanningActions = ({ data, DataList = [], reloadData = () => { } }) => {
    const isEditPermitted = HasAccess("EDIT_MANPOWER");
    const isDeletePermitted = HasAccess("DELETE_MANPOWER");
    const isViewPermitted = HasAccess("VIEW_MANPOWER");
    const [view, setView] = useState(null);
    const [openEditForm, setOpenEditForm] = useState(null);
    const [deleteForm, setDeleteForm] = useState(null);

    const handleView = () => {
        setView(true);
    };

    const handleEdit = (e) => {
        setOpenEditForm(true)
    };

    const handleDelete = () => {
        setDeleteForm(true);
    };

    const confirmDelete = async () => {
        try {
            await deleteRecord(`/manpower-plans/${data.id}`, `Manpower planning for year ${data.fiscal_year}`);
            setDeleteForm(null);
            reloadData(true);
        } catch (error) {
            console.error("ERROR", error);
        }
    };

    return (
        <>
            <DropdownActionMenu
                onView={isViewPermitted ? handleView : null}
                onEdit={isEditPermitted ? handleEdit : null}
                onDelete={isDeletePermitted ? handleDelete : null}
                viewText="View Manpower Planning"
                editText="Edit Manpower Planning"
                deleteText="Delete Manpower Planning"
                menuTooltip="Manpower Planning Actions"
            />

            {deleteForm && (
                <AlertDialogue
                    title="Confirm Delete?"
                    description={`This action can't be undone. All information associated with manpower planning for year ${data.fiscal_year} will be lost.`}
                    isOpen={deleteForm}
                    setIsOpen={(isOpen) =>
                        setDeleteForm(false)
                    }
                    handleContinue={confirmDelete}
                />
            )}

            {view && (
                <ViewManpowerPlanning
                    isOpen={view}
                    setIsOpen={() =>
                        setView(false)
                    }
                    currentId={data?.id}
                    reloadData={reloadData}
                    DataList={DataList}
                />
            )}
            {openEditForm && (
                <AddUpdateManpower
                    isOpen={openEditForm}
                    reloadData={() => {
                        reloadData(true);
                        setOpenEditForm(false);
                    }}
                    setIsOpen={() => {
                        setOpenEditForm(false);
                    }}
                    id={data.id}
                />
            )}
        </>
    );
};

export default ManpowerPlanningActions;
