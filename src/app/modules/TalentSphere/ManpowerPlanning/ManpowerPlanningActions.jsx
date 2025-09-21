import React, { useState } from "react";
import AlertDialogue from "components/ui/AlertDialogue";
import { ViewManpowerPlanning, AddUpdateManpower } from "app/modules/TalentSphere";
import DropdownActionMenu from "components/DropdownActionMenu";
import { toast } from "react-toastify";
import { deleteRecord } from "app/hooks/general";
import { useNavigate } from "react-router-dom";
import { HasAccess } from "utils/PermissionUtils";

const ManpowerPlanningActions = ({ data, DataList = [], reloadData = () => { } }) => {
    const isEditPermitted = HasAccess("EDIT_USER_ROLE");
    const isDeletePermitted = HasAccess("EDIT_USER_ROLE");
    const isViewPermitted = HasAccess("EDIT_USER_ROLE");
    const [view, setView] = useState(null);
    const [openEditForm, setOpenEditForm] = useState(null);
    const [deleteRecord, setDeleteRecord] = useState(null);
    const navigate = useNavigate();

    const handleView = () => {
        setView(true);
    };

    const handleEdit = (e) => {
        setOpenEditForm(true)
    };

    const handleDelete = () => {
        setDeleteRecord(true);
    };

    const confirmDelete = async () => {
        try {
            await deleteRecord(`/manpower-plans/${data.id}`, `Manpower planning for year ${data.fiscal_year}`);
            setDeleteRecord(null);
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

            {deleteRecord && (
                <AlertDialogue
                    title="Confirm Delete?"
                    description={`This action can't be undone. All information associated with manpower planning for year ${data.fiscal_year} will be lost.`}
                    isOpen={deleteRecord}
                    setIsOpen={(isOpen) =>
                        setDeleteRecord(false)
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
