import { toast } from "react-toastify";
import React, { useState } from "react";
import { FormatID } from "utils/getValuesFromTables";
import { getApplicantsData, saveUpdateApplication, saveUpdateResumeBankApplication, saveUpdateRejectedApplication } from "app/hooks/talentSphere";
import {
  ClearanceSheet,
  UploadExitInterviewDetails,
} from "app/modules/ExitAndClearance";
import { Button } from "components/ui/button";
// import { CoverFileUpload } from "components/FormControl";
import {
  EmployeeOverview,
  SheetUI,
  StatusLabel,
  NavigationSheetComponent,
  DetailContent,
  StatusList,
  StatusButtons,
} from "components";
import { RejectedApplication, ResumeBankApplication } from "app/utils/Types/TalentSphere";
import { renderDate } from "utils/renderValues";
import { GetDispatchStateList } from "utils/Lists";
import { ApplicantDetails } from "app/modules/TalentSphere/Sections";
import { TextAreaInput } from "components/FormControl";
import { SelectInputComponent } from "components/FormControl";

const StatusConfig = {
  'rejected': {
    successMessage: "Application Rejected Successfully!",
    saveUpdateApplicationResponse: saveUpdateRejectedApplication,
    FormSheetData: { title: 'Rejection Reson', },
  },
  'resume_bank': {
    successMessage: "Application Moved to Resume Bank Successfully!",
    saveUpdateApplicationResponse: saveUpdateResumeBankApplication,
    FormSheetData: { title: 'Add to Resume Bank', },
  }
}

const ViewApplicationDetail = ({
  currentId,
  isResignation = true,
  DataList = [],
  reloadData = () => { },
  isOpen,
  setIsOpen = () => { },
  handleUploadClearanceReportClick = () => { },
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
      debugger
      const { status, id } = values;
      const { saveUpdateApplicationResponse, successMessage } = StatusConfig[status];
      const response = await saveUpdateApplicationResponse(values, id);
      // return
      if (response) {
        await saveUpdateApplication({ status: values.status }, values.applicant);
        // toast.success(successMessage);
        setForceLoad(!forceLoad);
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
        handleSubmit({ id: data.id, status: status }, 'Screened')
      }
      if (status === "rejected") {
        setFormData({
          status: status,
          ...RejectedApplication,
          applicant: data.id,
        })
        setOpenFormModal(true);
      } else if (status === "COMPLETED") {
        handleUploadClearanceReportClick(data.id);
        setIsOpen(false)
        reloadData(true)
      }
      else if (status === "EXIT_INTERVIEW") {
        setOpenexitInterviewForm(true);
        setExitData(data)
      }
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
          if (
            data.status &&
            data.status.toLowerCase() === "new"
          )
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
          if (
            data.clearance_status &&
            data.clearance_status.toLowerCase() === "initiated"
          )
            return (
              <Button
                variant="outline"
                onClick={(event) => handleClick(event, "COMPLETED", data)}
              >
                Complete Clearance
              </Button>
            );
          // Completed clearance - check if exit interview is available
          if (
            data.clearance_status &&
            data.clearance_status.toLowerCase() === "completed"
          ) {
            // Check if this is resignation/termination AND clearance is fully done
            const isExitType = ["RESIGNATION", "TERMINATION"].includes(
              data.exit_category
            );

            const isClearanceCompleted = data?.is_clearance_handover === true; // Your boolean flag

            if (isExitType && isClearanceCompleted) {
              return (
                <div className="space-y-2">
                  <div className="text-sm text-green-600 font-medium">
                    ✓ Exit Interview form is now available.
                  </div>
                  <Button
                    variant="outline"
                    onClick={(event) => handleClick(event, "EXIT_INTERVIEW", data)}
                  >
                    Proceed for Exit Interview
                  </Button>
                </div>
              );
            } else {
              return (
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    disabled={true}
                  >
                    Exit Interview
                  </Button>
                  <div className="text-sm text-amber-600">
                    {!isExitType
                      ? "Exit interview not applicable for this clearance type"
                      : "Waiting for all clearance items to be completed"
                    }
                  </div>
                </div>
              );
            }
          }


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
                  ...(FormData.status === 'rejected' ? [{
                    InputField: TextAreaInput,
                    name: "rejection_reason",
                    required: true,
                    label: "Reason",
                  }] : []),
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
