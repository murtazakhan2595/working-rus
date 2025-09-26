import React, { useState } from "react";
import { ViewApplicationDetail, AddUpdateRequisitionRequestForm, AddUpdateVacancyForm } from "app/modules/TalentSphere";
import DropdownActionMenu from "components/DropdownActionMenu";
import { HasAccess } from "utils/PermissionUtils";

const ApplicationActions = ({ data, DataList = [], reloadData = () => { }, isTeamView = false }) => {
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
                viewText="View Application"
                editText="Edit Application"
                menuTooltip="Application Actions"
            />

            {view && (
                <ViewApplicationDetail
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
export default ApplicationActions;
