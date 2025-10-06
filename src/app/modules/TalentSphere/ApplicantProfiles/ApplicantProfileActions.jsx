import React, { useState, useEffect } from "react";
import { ApplicantProfileDetails, AddUpdateRequisitionRequestForm, AddUpdateVacancyForm } from "app/modules/TalentSphere";
import DropdownActionMenu from "components/DropdownActionMenu";
import { HasAccess } from "utils/PermissionUtils";
import { ScheduleInterviewSheet } from "app/modules/TalentSphere/ScreenedApplicants";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const ApplicantProfileActions = ({ data, DataList = [], reloadData = () => { }, isTeamView = false }) => {
    const [view, setView] = useState(null);
    const [edit, setEdit] = useState(null);
    const [interview, setInterview] = useState(null);
    const navigate = useNavigate();
    const handleView = () => {
        navigate(`/talent-sphere/applicant/${data.id}`)
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
                // onDelete={data.status === 'screened' ? handleDelete : null}
                viewText="View Applicant"
                editText="Edit Application"
                deleteText="Schedule Interview"
                menuTooltip="Profile Actions"
            />

            {view && (
                <ApplicantProfileDetails
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
                    id={data.id}
                    mode="add"
                    reloadData={reloadData}

                />

            )}

        </>
    );
};
export default ApplicantProfileActions;
