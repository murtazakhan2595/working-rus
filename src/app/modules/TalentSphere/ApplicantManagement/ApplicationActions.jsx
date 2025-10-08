import React, { useState, useEffect } from "react";
import { ViewApplicationDetail, AddUpdateRequisitionRequestForm, AddUpdateVacancyForm } from "app/modules/TalentSphere";
import DropdownActionMenu from "components/DropdownActionMenu";
import { HasAccess } from "utils/PermissionUtils";
import { ScheduleInterviewSheet } from "app/modules/TalentSphere/ScreenedApplicants";
import { useDispatch } from "react-redux";

const ApplicationActions = ({ data, DataList = [], reloadData = () => { }, isTeamView = false }) => {
    const isEditPermitted = HasAccess("MARK_ATTENDANCE");


    const [view, setView] = useState(null);
    const [edit, setEdit] = useState(null);
    const [interview, setInterview] = useState(null);

    const handleView = () => {
        setView(true)
    };
    const handleEdit = () => {
        setEdit(true)
    };

    const handleDelete = () => {
        setInterview(true)
    }




    return (
        <>
            <DropdownActionMenu
                onView={handleView}
                // onEdit={handleEdit}
                onDelete={data.status === 'screened' ? handleDelete : null}
                viewText="View Application"
                editText="Edit Application"
                deleteText="Schedule Interview"
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
                    currentId={data.applicant_id}
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
            {interview && (
                <ScheduleInterviewSheet
                    isOpen={interview}
                    setIsOpen={() => setInterview(false)}
                    // id={data.id}
                    applicant={data.id}
                    mode="add"
                    reloadData={reloadData}
                />

            )}

        </>
    );
};
export default ApplicationActions;
