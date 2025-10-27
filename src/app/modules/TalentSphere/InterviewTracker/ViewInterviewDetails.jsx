import React, { useState } from "react";
import { getInterviewById } from "app/hooks/talentSphere";
import { Button } from "components/ui/button";
import {
  NavigationSheetComponent,
  DetailContent,
} from "components";
import { InterviewDetails, ApplicantInformation, VacancyDetails } from "app/modules/TalentSphere/Sections";
import { AddInterviewFeedback, ViewInterviewFeedback } from "app/modules/TalentSphere";
import { useSelector } from "react-redux";
import { HasAccess } from "utils/PermissionUtils";
import moment from "moment";

const ViewInterviewDetails = ({
  currentId,
  DataList = [],
  reloadData = () => { },
  isOpen,
  setIsOpen = () => { },
  isTeamView = false,
}) => {
  const isAddFeedbackPermitted = HasAccess("ADD_INTERVIEW_FEEDBACK");
  const isViewFeedbackPermitted = HasAccess("VIEW_OWN_INTERVIEW_FEEDBACK");

  const { id: user_id } = useSelector((state) => state.user.userProfile);
  const [forceLoad, setForceLoad] = useState(false);
  const [OpenFeedbackForm, setOpenFeedbackForm] = useState(false);
  const [OpenViewFeedback, setOpenViewFeedback] = useState(false);
  const [CurrentData, setCurrentData] = useState(null);

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
          if (data.applicant) return true;
          return false;
        },
        renderContent: ({ applicant }) => (
          <DetailContent
            fields={ApplicantInformation}
            currentItem={applicant || {}}
          />
        )
      },
      {
        customContent: true,
        renderContent: (data) => {
          return (
            <DetailContent
              fields={VacancyDetails}
              currentItem={data?.applicant?.publish_vacancy || {}}
            />
          );
        },
      },
      ...(InterviewDetails || []),
      {
        customContent: true,
        className: "flex flex-wrap justify-end gap-2 my-5",
        renderContent: (data) => {
          if (!data) return null;
          const isInterViewDone = moment(data.scheduled_datetime).local().isSameOrBefore(moment());
          if (!isInterViewDone)
            return (
              <div className="text-amber-500 text-sm">
                Awaiting completion of the interview.
              </div>
            );
          const panelist_included = (data.panel || []).includes(user_id);
          const feedback_submitted = (data.interview_feedback || []).find(obj => obj.panel_member === user_id);
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
          </>
          );
        },
      },
    ],
    [handleClick, isViewFeedbackPermitted, isAddFeedbackPermitted, user_id]
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
          feedbackForm={CurrentData.interview_form}
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
          currentId={[CurrentData?.id]}
          isTeamView={isTeamView}
        />
      }
    </>
  );
};

export default ViewInterviewDetails;
