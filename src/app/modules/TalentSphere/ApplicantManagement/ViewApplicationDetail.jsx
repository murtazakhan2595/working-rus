import React, { useState } from "react";
import { getApplicantsData, } from "app/hooks/talentSphere";
import { Button } from "components/ui/button";
import {
  NavigationSheetComponent,
  DetailContent,
} from "components";
import { ApplicantDetails } from "app/modules/TalentSphere/Sections";
import { UpdateApplicantStatus, ViewInterviewFeedback, GenerateOffer } from "app/modules/TalentSphere";
import { ApplicantStatusList } from './StatusList'

const ViewApplicationDetail = ({
  currentId,
  DataList = [],
  reloadData = () => { },
  isOpen,
  setIsOpen = () => { },
  statusUpdated = () => { },
}) => {
  const [forceLoad, setForceLoad] = useState(false);
  const [FormData, setFormData] = useState({});
  const [OpenFormModal, setOpenFormModal] = useState(false);
  const [OpenViewFeedback, setOpenViewFeedback] = useState(false);
  const [OpenOfferForm, setOpenOfferForm] = useState(false);

  const handleClick = React.useCallback(
    async (event, status, data) => {
      event.preventDefault();
      event.stopPropagation();
      if (status === 'view-feedback') {
        const interview_ids = (data.interviews || []).map(interview => interview.id);
        setFormData({ id: interview_ids });
        setOpenViewFeedback(true);

        return null;
      }
      if (status === 'generate-offer') {
        setFormData({ applicant: data.id });
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

  const fields = React.useMemo(
    () => [
      ...(ApplicantDetails || []),
      {
        customContent: true,
        className: "flex flex-wrap justify-end gap-2 my-5",
        renderContent: (data) => {
          console.log(data, 'APPLICATION DATA')
          if (!data || !data.status || !data.status.toLowerCase()) return null;
          const Options = ApplicantStatusList[data.status.toLowerCase()];
          return (Options || []).map((option, index) => (
            <Button
              variant={option.variant}
              key={`applicant-${option.status}-${index}`}
              onClick={(event) => handleClick(event, option.status, data)}
            >
              {option.label}
            </Button>
          ))
        },
      },
    ], [handleClick,]
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
          applicant={FormData?.applicant}
        />
      }
    </>
  );
};

export default ViewApplicationDetail;
