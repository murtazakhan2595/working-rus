import React, { useState, useEffect } from "react";
import { ViewInterviewDetails, AddUpdateRequisitionRequestForm, AddUpdateVacancyForm } from "app/modules/TalentSphere";
import DropdownActionMenu from "components/DropdownActionMenu";
import { HasAccess } from "utils/PermissionUtils";
import { ScheduleInterviewSheet } from "app/modules/TalentSphere/ScreenedApplicants";
import { useDispatch } from "react-redux";

const InterviewActions = ({ data, DataList = [], reloadData = () => { }, isTeamView = false }) => {
    const isSchedulePermitted = HasAccess("VIEW_APPLICANT_INPROGRESS_INTERVIEWS");
    const isAddFeedbackPermitted = HasAccess("VIEW_APPLICANT_INPROGRESS_INTERVIEWS");
    const isViewFeedbackPermitted = HasAccess("VIEW_APPLICANT_INPROGRESS_INTERVIEWS");
    const isUpdateStatusPermitted = HasAccess("VIEW_APPLICANT_INPROGRESS_INTERVIEWS");


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
    const handleScheduleInterview = () => {
        setInterview(true)
    }
    const handleAddFeedback = () => {
        setInterview(true)
    }
    const handleViewFeedback = () => {
        setInterview(true)
    }
    const handleUpdateStatus = () => {
        setInterview(true)
    }

    return (
        <>
            <DropdownActionMenu
                 onView={handleView}
                // onEdit={handleEdit}
                // onDelete={data.status === 'screened' ? handleDelete : null}
                viewText="View Details"
                editText="Edit Application"
                deleteText="Schedule Interview"
                menuTooltip="Application Actions"
                additionalOptionsConfig={[
                    ...(data.is_draft === 'approved' && isSchedulePermitted ? [{ text: 'Schedule Another Interview', action: handleScheduleInterview }] : []),
                    ...(data.is_draft === 'approved' && isAddFeedbackPermitted ? [{ text: 'Add Feedback', action: handleAddFeedback }] : []),
                    ...(data.is_draft === 'approved' && isViewFeedbackPermitted ? [{ text: 'View Feedback', action: handleViewFeedback }] : []),
                    ...(data.is_draft === 'approved' && isUpdateStatusPermitted ? [{ text: 'Update Status', action: handleUpdateStatus }] : []),
                ]}
            />

            {view && (
                <ViewInterviewDetails
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
export default InterviewActions;
