import React, { useState } from "react";
import { getApplicantsData, } from "app/hooks/talentSphere";
import { Button } from "components/ui/button";
import {
  NavigationSheetComponent,
  DetailContent,
} from "components";
import { ApplicantDetails } from "app/modules/TalentSphere/Sections";
import { UpdateApplicantStatus, ViewInterviewFeedback, GenerateOffer, ScheduleInterviewSheet, AddInterviewFeedback } from "app/modules/TalentSphere";
import { ApplicantStatusList } from './StatusList'
import moment from "moment";
import { useSelector } from "react-redux";
import { usePermissions } from "utils/PermissionUtils";

const ViewApplicationDetail = ({
  currentId,
  DataList = [],
  reloadData = () => { },
  isOpen,
  setIsOpen = () => { },
  statusUpdated = () => { },
  autoAction = null,
}) => {
  const { hasAccess } = usePermissions();
  const addFeedBackPermitted = hasAccess("ADD_INTERVIEW_FEEDBACK");
  const viewFeedBackPermitted = hasAccess("VIEW_INTERVIEW_FEEDBACK");
  const updateStatusPermitted = hasAccess("UPDATE_APPLICANT_STATUS");
  const generateOfferPermitted = hasAccess("UPDATE_APPLICANT_STATUS");
  const scheduleInterviewPermitted = hasAccess("UPDATE_APPLICANT_STATUS");
  const { id: user_id } = useSelector((state) => state.user.userProfile);
  const [forceLoad, setForceLoad] = useState(false);
  const [FormData, setFormData] = useState({});
  const [OpenFormModal, setOpenFormModal] = useState(false);
  const [OpenViewFeedback, setOpenViewFeedback] = useState(false);
  const [OpenOfferForm, setOpenOfferForm] = useState(false);
  const [OpenInterviewForm, setOpenInterviewForm] = useState(false);
  const [OpenFeedbackForm, setOpenFeedbackForm] = useState(false);
  const [hasTriggeredAction, setHasTriggeredAction] = useState(false);

  const Permissions = React.useMemo(() => {
    return {
      'add-feedback': addFeedBackPermitted,
      'view-feedback': viewFeedBackPermitted,
      'update-status': updateStatusPermitted,
      'generate-offer': generateOfferPermitted,
      'schedule-interview': scheduleInterviewPermitted,
    };
  }, [addFeedBackPermitted, viewFeedBackPermitted, scheduleInterviewPermitted, generateOfferPermitted]);

  const handleClick = React.useCallback(
    async (event, status, data) => {
      event?.preventDefault?.();
      event?.stopPropagation?.();
      if (status === 'view-feedback') {
        const interview_ids = (data.interviews || []).map(interview => interview.id);
        setFormData({ id: interview_ids });
        setOpenViewFeedback(true);
        return null;
      }
      if (status === 'reschedule-interview') {

        const latest_interview = data?.latest_interview;
        setFormData({
          applicant: data.id,
          id: latest_interview?.id,
        });
        setOpenInterviewForm(true);
        return null;
      }
      if (status === 'schedule-interview') {
        setFormData({
          applicant: data.id,
        });
        setOpenInterviewForm(true);
        return null;
      }
      if (status === 'add-feedback') {
        const latest_interview = data?.latest_interview;
        setFormData({
          form: latest_interview?.interview_form,
          id: latest_interview?.id,
        });
        setOpenFeedbackForm(true);
        return null;
      }
      if (status === 'generate-offer') {
        setFormData({
          applicant: data.id,
          expected_joining_date: data?.recruitment_shortlist?.expected_joining_date,
          designation: data.job_title,
          work_location: data.location,
        });
        setOpenOfferForm(true);
        return null;
      }

      const FormData = {
        status: status,
        applicant: data.id,
        status_variant: status,
        initialData: {},
      }
      if (status === 'hold')
        FormData.status_variant = 'default';
      if (status === 'revert_hold') {
        FormData.status_variant = 'revert_hold';
        FormData.status = 'in_progress';
      }
      if (status === 'remove-resume-bank') {
        FormData.status_variant = 'remove_resume_bank';
        FormData.status = 'rejected';
      }
      if (status === 'remove_blacklist') {
        FormData.status = 'rejected';
        FormData.initialData = data?.blacklist ?? {};
      }
      setFormData(FormData)
      setOpenFormModal(true);
    },
    [setOpenFormModal, setFormData, setOpenViewFeedback]
  );

  const fetchData = async (id, isMounted) => {
    try {
      const response = await getApplicantsData(id);
      if (isMounted) return response;
    } catch (error) {
      console.error("Error fetching exit data:", error);
    }
    return null; // Always return something
  };

  // Auto-trigger actions if requested via deep-link (only once)
  const triggerAutoAction = React.useCallback((data) => {
    if (!data || !autoAction || hasTriggeredAction) return;

    setHasTriggeredAction(true);
    if (autoAction === 'reschedule') {
      handleClick(null, 'reschedule-interview', data);
    } else if (autoAction === 'add-feedback') {
      handleClick(null, 'add-feedback', data);
    }
  }, [autoAction, handleClick, hasTriggeredAction]);

  // Reset triggered action state when component opens/closes
  React.useEffect(() => {
    if (isOpen) {
      setHasTriggeredAction(false);
    }
  }, [isOpen]);

  const fields = React.useMemo(
    () => [
      ...(ApplicantDetails || []),
      {
        customContent: true,
        className: "flex flex-wrap justify-end gap-2 my-5",
        renderContent: (data) => {
          if (!data || !data.status || !data.status.toLowerCase()) return null;
          // Trigger auto action once when data is available
          triggerAutoAction(data);
          const status = data.status.toLowerCase();
          let statusKey = status;
          if (status === 'in progress') {
            const latest_interview = data?.latest_interview;
            if (!latest_interview || latest_interview.status !== 'scheduled') return null;
            const isInterViewDone = moment(latest_interview.scheduled_datetime).isSameOrBefore(moment());
            if (!isInterViewDone) return null;
            const panelist_included = (latest_interview.panel || []).includes(user_id);
            const feedback_submitted = (data.interview_feedbacks || []).find(obj => (obj.panel_member === user_id && obj.interview === latest_interview.id));
            if (panelist_included && !feedback_submitted) statusKey = 'feedack';
          }
          const isOfferGenerated = data?.offer_tracking || (data?.offer_letter?.[data?.offer_letter?.length - 1] || {}).status !== 'rejected';
          const Options = ApplicantStatusList[statusKey];
          return (Options || []).map((option, index) => {
            if (option.status === 'generate-offer' && isOfferGenerated) return <></>;
            if (option.status === 'view-feedback' && (!data?.interview_feedbacks || !data?.interview_feedbacks?.length)) return <></>;
            if (!Permissions[option.permission]) return <></>
            return (
              <Button
                variant={option.variant}
                key={`applicant-${option.status}-${index}`}
                onClick={(event) => handleClick(event, option.status, data)}
              >
                {option.label}
              </Button>
            )
          })
        },
      },
    ], [handleClick, triggerAutoAction]
  );

  return (
    <>
      <NavigationSheetComponent
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title={`Application Details`}
        currentItem_Id={currentId}
        ForceItemLoad={forceLoad}
        dataList={DataList}
        reloadData={reloadData}
        allowEdit={false}
        allowDelete={false}
        fetchCurrentItemDetails={fetchData}
        dataUniqueKey='applicant_id'
      >
        <DetailContent fields={fields} />
      </NavigationSheetComponent>
      {OpenFormModal && (
        <UpdateApplicantStatus
          status={FormData.status}
          status_variant={FormData.status_variant}
          applicant={FormData.applicant}
          reloadData={() => { reloadData(true); setForceLoad(!forceLoad) }}
          isOpen={OpenFormModal}
          setIsOpen={setOpenFormModal}
          statusUpdated={statusUpdated}
          initialData={FormData.initialData}
        />
      )}
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
          currentId={FormData?.id}
        />
      }
      {OpenOfferForm &&
        <GenerateOffer
          isOpen={OpenOfferForm}
          reloadData={() => {
            setForceLoad(!forceLoad);
            setOpenOfferForm(false);
          }}
          setIsOpen={() => {
            setOpenOfferForm(false);
          }}
          initialData={FormData}
        />
      }
      {OpenInterviewForm &&
        <ScheduleInterviewSheet
          isOpen={OpenInterviewForm}
          setIsOpen={() => setOpenInterviewForm(false)}
          id={FormData.id}
          applicant={FormData.applicant}
          mode="add"
          reloadData={reloadData}
        />
      }
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
          feedbackForm={FormData.form}
          id={FormData.id}
        />
      }
    </>
  );
};

export default ViewApplicationDetail;
