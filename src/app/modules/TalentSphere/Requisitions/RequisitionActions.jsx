import React, { useState } from "react";
import { ViewRequisitionRequest, AddUpdateRequisitionRequestForm, AddUpdateVacancyForm } from "app/modules/TalentSphere";
import DropdownActionMenu from "components/DropdownActionMenu";
import { HasAccess } from "utils/PermissionUtils";

const RequisitionActions = ({ data, DataList = [], reloadData = () => { }, isTeamView = false }) => {
    const isEditPermitted = HasAccess("EDIT_REQUISITION_REQUEST");
    const isPublishPermitted = HasAccess("PUBLISH_VACANCY");
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
    return (
        <>
            <DropdownActionMenu
                onView={handleView}
                onEdit={isEditPermitted && data.is_draft ? handleEdit : null}
                viewText="View Requisition"
                editText="Edit Requisition"
                menuTooltip="Requisition Actions"
                additionalOptionsConfig={[...(data.status === 'approved' && isPublishPermitted ? [{ text: 'Publish Vacancy', action: handlePublish }] : []),]}
            />

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
