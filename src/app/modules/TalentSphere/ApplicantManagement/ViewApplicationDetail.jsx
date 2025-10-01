import React, { useState } from "react";
import {
  getApplicantsData, saveUpdateApplication,
  saveUpdateResumeBankApplication,
  saveUpdateRejectedApplication,
  saveUpdateShortlistedApplicant
} from "app/hooks/talentSphere";
import { Button } from "components/ui/button";
// import { CoverFileUpload } from "components/FormControl";
import {
  SheetUI,
  NavigationSheetComponent,
  DetailContent,
} from "components";
import { RejectedApplication, ResumeBankApplication, ShortlistedApplicant } from "app/utils/Types/TalentSphere";
import { GetDispatchStateList } from "utils/Lists";
import { ApplicantDetails } from "app/modules/TalentSphere/Sections";
import { TextAreaInput } from "components/FormControl";
import { SelectInputComponent } from "components/FormControl";
import { NumberInput } from "components/FormControl";
import { DateInput } from "components/FormControl";

const StatusConfig = {
  'rejected': {
    successMessage: "Application Rejected Successfully!",
    saveUpdateApplicationResponse: saveUpdateRejectedApplication,
    FormSheetData: { title: 'Rejection Reason', },
  },
  'shortlisted': {
    successMessage: "Application Rejected Successfully!",
    saveUpdateApplicationResponse: saveUpdateShortlistedApplicant,
    FormSheetData: { title: 'Add Shortlisting Details', },
  },
  'resume_bank': {
    successMessage: "Application Moved to Resume Bank Successfully!",
    saveUpdateApplicationResponse: saveUpdateResumeBankApplication,
    FormSheetData: { title: 'Add to Resume Bank', },
  },
  'screened': {
    successMessage: "Application Screened Successfully!",
    saveUpdateApplicationResponse: saveUpdateApplication,
    FormSheetData: { title: 'Add to Screen', },
  },
  'default': {
    successMessage: "Application Holded Successfully!",
    saveUpdateApplicationResponse: saveUpdateApplication,
  },
}

const ViewApplicationDetail = ({
  currentId,
  isResignation = true,
  DataList = [],
  reloadData = () => { },
  isOpen,
  setIsOpen = () => { },
  statusUpdated = () => { },
}) => {
  const Designations = GetDispatchStateList('branches', 'common');
  const Departments = GetDispatchStateList('departments', 'common');
  const [forceLoad, setForceLoad] = useState(false);
  const [FormData, setFormData] = useState({});
  const [OpenFormModal, setOpenFormModal] = useState(false);
  const [openexitInterviewForm, setOpenexitInterviewForm] = useState(false);
  const [currentItemId, setCurrentItemId] = useState(null);
  const [exitData, setExitData] = useState(null);
  const handleSubmit = async (values) => {
    try {
      const { status, id } = values;
      const { saveUpdateApplicationResponse, successMessage } = StatusConfig[status] || StatusConfig['default'];
      const response = await saveUpdateApplicationResponse(values, id);
      // return
      if (response) {
        if (status !== 'screened' && status !== 'hold' && status !== 'blacklisted')
          await saveUpdateApplication({ status: values.status }, values.applicant);
        setForceLoad(!forceLoad);
        statusUpdated(true);
        return {
          status: true,
          messageType: "SUCCESS",
          title: successMessage,
          description: `Applicant status is updated successfully.`,
        }
      }
    } catch (error) {
      // Handle errors and rollback form data
      console.error(error);
    } finally {
      setOpenFormModal(false)
      setFormData({})
    }
  };

  const handleClick = React.useCallback(
    async (event, status, data) => {
      event.preventDefault();
      event.stopPropagation();
      setCurrentItemId(data.id);
      if (status === 'resume_bank') {
        setFormData({
          status: status,
          ...ResumeBankApplication,
          applicant: data.id,
        })
        setOpenFormModal(true);
      }
      if (status === 'screened') {
        handleSubmit({ id: data.id, status: status })
      }
      if (status === "rejected") {
        setFormData({
          status: status,
          ...RejectedApplication,
          applicant: data.id,
        })
        setOpenFormModal(true);
      } if (status === "shortlisted") {
        setFormData({
          status: status,
          ...ShortlistedApplicant,
          applicant: data.id,
        })
        setOpenFormModal(true);
      }
      else { handleSubmit({ id: data.id, status: status }) }
    },
    [setOpenFormModal, handleSubmit, setCurrentItemId]
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
        },
      },
    ],
    [
      handleClick,
      isResignation,
      forceLoad,
      setForceLoad,
    ]
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
        <SheetUI
          isOpen={OpenFormModal}
          setIsOpen={setOpenFormModal}
          variant="modal"
          sheetConfig={StatusConfig[FormData.status]?.FormSheetData}
          formConfig={{
            initialValues: FormData,
            enableReinitialize: true,
            handleSubmit: handleSubmit,
            validateFormSchema: () => {
              const error = {};
              return error;
            },
            submitButtonText: "Confirm",
            cancelButtonText: "Cancel",
            columns: 1,
            formFields: [
              {
                sheetCardExtension: false,
                // sheetCardTitle: "Salary Details",
                InputFields: [
                  ...(FormData.status === 'rejected' ? [
                    {
                      InputField: TextAreaInput,
                      name: "rejection_reason",
                      required: true,
                      label: "Reason",
                    },
                    {
                      InputField: TextAreaInput,
                      name: "remarks",
                      label: "Remarks",
                    },
                  ] : []),
                  ...(FormData.status === 'resume_bank' ? [{
                    InputField: SelectInputComponent,
                    name: "recommended_department",
                    options: Departments,
                    required: true,
                    label: "Recommended Department",
                  },
                  {
                    InputField: SelectInputComponent,
                    name: "recommended_designation",
                    required: true,
                    label: "Recommended Designation",
                    options: Designations,
                  },] : []),
                  ...(FormData.status === 'shortlisted' ? [{
                    InputField: NumberInput,
                    name: "desired_salary",
                    required: true,
                    label: "Desired Salary",
                  },
                  {
                    InputField: DateInput,
                    name: "expected_joining_date",
                    required: true,
                    label: "Expected Joining Date",
                  },
                  {
                    InputField: TextAreaInput,
                    name: "remarks",
                    required: true,
                    label: "Remarks",
                  },] : []),
                ].filter(Boolean),
              },
            ],
          }}
        ></SheetUI>
      )}
    </>
  );
};

export default ViewApplicationDetail;
