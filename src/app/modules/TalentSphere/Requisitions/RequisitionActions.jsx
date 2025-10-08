import React, { useState } from "react";
import { ViewRequisitionRequest, AddUpdateRequisitionRequestForm, AddUpdateVacancyForm } from "app/modules/TalentSphere";
import DropdownActionMenu from "components/DropdownActionMenu";
import { HasAccess } from "utils/PermissionUtils";
import AlertDialogue from "components/ui/AlertDialogue";
import { deleteRecord } from "app/hooks/general";

const RequisitionActions = ({ data, DataList = [], reloadData = () => { }, isTeamView = false }) => {
    const isEditPermitted = HasAccess("EDIT_REQUISITION_REQUEST");
    const isPublishPermitted = HasAccess("PUBLISH_VACANCY");
    const isDeletePermitted = HasAccess("DELETE_MANPOWER");
    const [deleteForm, setDeleteForm] = useState(null);

    const [view, setView] = useState(null);
    const [edit, setEdit] = useState(null);
    const [openPublishVacancyForm, setopenPublishVacancyForm] = useState(null);
    const handleView = () => {
        setView(true)
    };
    const handleEdit = () => {
        setEdit(true)
    };
    const handlePublish = () => {
        setopenPublishVacancyForm(true)
    };

    const handleDelete = () => {
        setDeleteForm(true);
    };

    const confirmDelete = async () => {
        try {
            await deleteRecord(`/requisition-requests/${data.id}`, `Requisition request for ${data.job_title}`);
            setDeleteForm(null);
            reloadData(true);
        } catch (error) {
            console.error("ERROR", error);
        }
    };
    return (
        <>
            <DropdownActionMenu
                onView={handleView}
                onEdit={isEditPermitted && ['pending', 'draft'].includes(data.status.toLowerCase()) ? handleEdit : null}
                onDelete={isDeletePermitted && ['pending', 'draft'].includes(data.status.toLowerCase()) ? handleDelete : null}
                viewText="View Requisition"
                editText="Edit Requisition"
                deleteText="Delete Requisition"
                menuTooltip="Requisition Actions"
                additionalOptionsConfig={[...(data.status === 'approved' && isPublishPermitted ? [{ text: 'Publish Vacancy', action: handlePublish }] : []),]}
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
                <ViewRequisitionRequest
                    isOpen={view}
                    reloadData={() => {
                        reloadData(true);
                        setView(false);
                    }}
                    setIsOpen={() => {
                        setView(false);
                    }}
                    currentId={data.id}
                    DataList={DataList}
                    isTeamView={isTeamView}
                />
            )}
            {edit && (
                <AddUpdateRequisitionRequestForm
                    isOpen={edit}
                    reloadData={() => {
                        reloadData(true);
                        setEdit(false);
                    }}
                    setIsOpen={() => {
                        setEdit(false);
                    }}
                    id={data.id}
                    approvalRequired={isTeamView}
                />
            )}
            {openPublishVacancyForm && (
                <AddUpdateVacancyForm
                    isOpen={openPublishVacancyForm}
                    reloadData={() => {
                        reloadData(true);
                        setEdit(false);
                    }}
                    setIsOpen={() => {
                        setEdit(false);
                    }}
                    requisition_id={data.id}
                />
            )}
        </>
    );
};
export default RequisitionActions;
