import React, { useState } from "react";
import { getApplicantsData, } from "app/hooks/talentSphere";
import { Button } from "components/ui/button";
import {
  NavigationSheetComponent,
  DetailContent,
} from "components";
import { ApplicantDetails } from "app/modules/TalentSphere/Sections";
import { UpdateApplicantStatus } from "app/modules/TalentSphere";


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

  const handleClick = React.useCallback(
    async (event, status, data) => {
      event.preventDefault();
      event.stopPropagation();
      const FormData = {
        status: status,
        applicant: data.id,
        status_variant: status,
        initialData:{},
      }
      if (status === 'hold')
        FormData.status_variant = 'default';
      if (status === 'remove_blacklist') {
        debugger
        FormData.status = 'rejected';
        FormData.initialData = data?.blacklist ?? {};
      }
      setFormData(FormData)
      setOpenFormModal(true);
    },
    [setOpenFormModal, setFormData]
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
          if (!data) return null;
          if (data.status && data.status.toLowerCase() === "new")
            return (<>
              <Button
                variant="outline"
                onClick={(event) => handleClick(event, "resume_bank", data)}
              >
                Resume Bank
              </Button>
              <Button
                variant="success"
                onClick={(event) => handleClick(event, "screened", data)}
              >
                Screened Candidate
              </Button>
              <Button
                variant="destructive"
                onClick={(event) => handleClick(event, "rejected", data)}
              >
                Reject
              </Button>
            </>
            );
          else if (data.status && data.status.toLowerCase() === "in progress")
            return <>
              <Button
                variant="continue"
                onClick={(event) => handleClick(event, "hold", data)}
              >
                Hold
              </Button>
              <Button
                variant="success"
                onClick={(event) => handleClick(event, "shortlisted", data)}
              >
                Shortlisted
              </Button>
              <Button
                variant="destructive"
                onClick={(event) => handleClick(event, "rejected", data)}
              >
                Reject
              </Button>
              <Button
                variant="destructive"
                onClick={(event) => handleClick(event, "blacklisted", data)}
              >
                Blacklisted
              </Button>
            </>
          else if (data.status && data.status.toLowerCase() === "blacklisted")
            return <>
              <Button
                variant="continue"
                onClick={(event) => handleClick(event, "remove_blacklist", data)}
              >
                Remove from Blacklist
              </Button>

            </>
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
    </>
  );
};

export default ViewApplicationDetail;
