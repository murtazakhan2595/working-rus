import React, { useState } from "react";
import { getInterviewById, saveUpdateInterview } from "app/hooks/talentSphere";
import { Button } from "components/ui/button";
import {
  NavigationSheetComponent,
  DetailContent,
} from "components";
import { InterviewDetails, ApplicantInformation } from "app/modules/TalentSphere/Sections";
import { AddInterviewFeedback, ViewInterviewFeedback, ViewApplicationDetail } from "app/modules/TalentSphere";
import { useSelector } from "react-redux";
import { HasAccess } from "utils/PermissionUtils";
import moment from "moment";
import { ScheduleInterviewSheet } from "app/modules/TalentSphere/ScreenedApplicants";

const ViewInterviewDetails = ({
  currentId,
  DataList = [],
  reloadData = () => { },
  isOpen,
  setIsOpen = () => { },
}) => {
  const isAddFeedbackPermitted = HasAccess("VIEW_APPLICANT_INPROGRESS_INTERVIEWS");
  const isViewFeedbackPermitted = HasAccess("VIEW_APPLICANT_INPROGRESS_INTERVIEWS");
  const isSchedulePermitted = HasAccess("VIEW_APPLICANT_INPROGRESS_INTERVIEWS");
  const isUpdateStatusPermitted = HasAccess("VIEW_APPLICANT_INPROGRESS_INTERVIEWS");

  const { id: user_id } = useSelector((state) => state.user.userProfile);
  const [forceLoad, setForceLoad] = useState(false);
  const [OpenScheduleInterview, setOpenScheduleInterview] = useState(false);
  const [OpenFeedbackForm, setOpenFeedbackForm] = useState(false);
  const [OpenViewFeedback, setOpenViewFeedback] = useState(false);
  const [OpenApplicationDetails, setOpenApplicationDetails] = useState(false);
  const [CurrentData, setCurrentData] = useState(null);

  const handleSubmit = async (values, id) => {
    try {
      const response = await saveUpdateInterview(values, id);
      if (response) {
        setForceLoad(!forceLoad);
      }
    } catch (error) {
      // Handle errors and rollback form data
      console.error(error);
    } finally {

    }
  }

  const handleClick = React.useCallback(
    async (event, status, data) => {
      event.preventDefault();
      event.stopPropagation();
      setCurrentData(data);
      if (status === 'add-feedback') {
        setOpenFeedbackForm(true);
      }
      else if (status === 'view-feedback') {
        setOpenViewFeedback(true);
      }
      else if (status === 'reschedule-interview') {
        setOpenScheduleInterview(true);
      }
      else if (status === 'update-status') {
        setOpenApplicationDetails(true);
      }
    },
    [setOpenViewFeedback, setOpenFeedbackForm, setCurrentData]
  );

  const fetchData = async (id, isMounted) => {
    try {
      const response = await getInterviewById(id);
      if (isMounted) return response;
    } catch (error) {
      console.error("Error fetching exit data:", error);
    }
    return null; // Always return something
  };

  const fields = React.useMemo(
    () => [
      {
        customContent: true,
        renderSectionCondition: (data) => {
          console.log(data);
          if (data.applicant) return true;
          return false;
        },
        renderContent: ({ applicant }) => <DetailContent
          fields={ApplicantInformation}
          currentItem={applicant || {}}
        />

      },
      ...(InterviewDetails || []),
      {
        customContent: true,
        className: "flex flex-wrap justify-end gap-2 my-5",
        renderContent: (data) => {
          if (!data) return null;
          const isInterViewDone = moment(data.scheduled_datetime).isSameOrBefore(moment());
          if (!isInterViewDone) return null;
          const panelist_included = (data.panel || []).includes(user_id);
          const feedback_submitted = (data.interview_feedbacks || []).find(obj => obj.panel_member === user_id);
          console.log(data, 'APPLICATION DATA', isAddFeedbackPermitted, isInterViewDone, feedback_submitted, panelist_included)
          return (<>
            {(isAddFeedbackPermitted && !feedback_submitted && panelist_included) &&
              <Button
                variant="outline"
                onClick={(event) => handleClick(event, "add-feedback", data)}
              >
                Add Feedback
              </Button>
            }
            {(isViewFeedbackPermitted && feedback_submitted && panelist_included) &&
              <Button
                variant="outline"
                onClick={(event) => handleClick(event, "view-feedback", { ...data, feedback: feedback_submitted })}
              >
                View Feedback
              </Button>
            }
            {isSchedulePermitted &&
              <Button
                // variant="outline"
                onClick={(event) => handleClick(event, "reschedule-interview", { ...data, })}
              >
                Reschedule Interview
              </Button>
            }
            {isUpdateStatusPermitted &&
              <Button
                variant="continue"
                onClick={(event) => handleClick(event, "update-status", { ...data, })}
              >
                Update Status
              </Button>
            }

          </>
          );
        },
      },
    ],
    [handleClick,]
  );

  return (
    <>
      <NavigationSheetComponent
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title={`Interview Details`}
        currentItem_Id={currentId}
        ForceItemLoad={forceLoad}
        dataList={DataList}
        reloadData={reloadData}
        allowEdit={false}
        allowDelete={false}
        fetchCurrentItemDetails={fetchData}
      // dataUniqueKey='applicant_id'
      >
        <DetailContent fields={fields} />
      </NavigationSheetComponent>
      {OpenFeedbackForm &&
        <AddInterviewFeedback
          isOpen={OpenFeedbackForm}
          reloadData={() => {
            setForceLoad(!forceLoad);
            setOpenFeedbackForm(false);
          }}
          setIsOpen={() => {
            setOpenFeedbackForm(false);
          }}
          feedbackForm={CurrentData.form}
          id={CurrentData.id}
        />
      }
      {OpenViewFeedback &&
        <ViewInterviewFeedback
          isOpen={OpenViewFeedback}
          reloadData={() => {
            setForceLoad(!forceLoad);
            setOpenViewFeedback(false);
          }}
          setIsOpen={() => {
            setOpenViewFeedback(false);
          }}
          currentId={CurrentData?.id}
        />
      }
      {OpenScheduleInterview &&
        <ScheduleInterviewSheet
          isOpen={OpenScheduleInterview}
          reloadData={() => {
            setOpenScheduleInterview(false);
            handleSubmit({ status: 'rescheduled' }, CurrentData.id)
          }}
          setIsOpen={() => {
            setOpenScheduleInterview(false);
          }}
          id={CurrentData?.applicant}
          vacancyId={CurrentData?.published_vacancy || CurrentData?.publish_vacancy?.id}
          mode="add"
        />
      }
      {OpenApplicationDetails &&
        <ViewApplicationDetail
          isOpen={OpenApplicationDetails}
          reloadData={() => {
            setOpenApplicationDetails(false);
          }}
          setIsOpen={() => {
            setOpenApplicationDetails(false);
          }}
          statusUpdated={(flag) => {
            if (flag)
              handleSubmit({ status: 'completed' }, CurrentData.id)
          }}
          currentId={CurrentData?.applicant}
        />
      }
    </>
  );
};

export default ViewInterviewDetails;
