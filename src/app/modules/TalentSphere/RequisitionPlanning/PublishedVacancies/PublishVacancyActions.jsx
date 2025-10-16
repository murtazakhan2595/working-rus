import React, { useState } from "react";
import { ViewPublishedVacancies, AddUpdateRequisitionRequestForm, AddUpdateVacancyForm } from "app/modules/TalentSphere";
import DropdownActionMenu from "components/DropdownActionMenu";
import { HasAccess } from "utils/PermissionUtils";

const PublishVacancyActions = ({ data, DataList = [], reloadData = () => { }, isTeamView = false }) => {
    const isEditPermitted = HasAccess("MARK_ATTENDANCE");
    const [view, setView] = useState(null);
    const [edit, setEdit] = useState(null);
    const handleView = () => {
        setView(true)
    };
    const handleEdit = () => {
        setEdit(true)
    };
   
    return (
        <>
            <DropdownActionMenu
                onView={handleView}
                // onEdit={isEditPermitted && data.is_draft ? handleEdit : null}
                viewText="Vacancy Requisition"
                editText="Vacancy Requisition"
                menuTooltip="Vacancy Actions"
            />

            {view && (
                <ViewPublishedVacancies
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
                <AddUpdateVacancyForm
                    isOpen={edit}
                    reloadData={() => {
                        reloadData(true);
                        setEdit(false);
                    }}
                    setIsOpen={() => {
                        setEdit(false);
                    }}
                    id={data.id}
                />
            )}
        </>
    );
};
export default PublishVacancyActions;
