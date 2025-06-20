import moment from "moment";
import React, { useState, useRef } from "react";
import {
  RenderResignationAction,
  RenderTerminationAction,
} from "app/modules/ExitAndClearance/ExitRequests";
import {
  DepartmentName,
  DesignationName,
  EmployeeID,
  TerminationStatus,
  ResignationReason,
  ResignationStatus,
  ManagerName,
} from "utils/getValuesFromTables";
import { FormatID } from "utils/getValuesFromTables";
import {
  saveEmployeeExitDetail,
  getEmployeeExitData,
} from "app/hooks/employeeExitAndClearance";
import { useSelector } from "react-redux";
import { TerminationReason } from "utils/getValuesFromTables";
import { Labels } from "components/StatusLabel";
import { Sheet, SheetContent, SheetHeader } from "src/@/components/ui/sheet";
import {
  ViewDetailHeader,
  ViewDetailBox,
  ViewAttachmentDetail,
} from "app/modules/ExitAndClearance/Sections/DetailViewPanel";
import { Button } from "components/ui/button";
// import { CoverFileUpload } from "components/FormControl";
import {
  EmployeeOverview,
  EmployeeDetailUI,
  StatusLabel,
  NavigationSheetComponent,
  DetailContent,
  StatusList,
} from "components";

import { renderDate } from "utils/renderValues";
import { HasAccess } from "utils/PermissionUtils";
import AttachmentUI from "components/ui/AttachmentUI";

const ExitDetailsCard = ({
  currentId,
  isResignation = true,
  DataList = [],
  reloadData = () => {},
  isOpen,
  setIsOpen = () => {},
}) => {
  const managePermitted = HasAccess("MANAGE_EXIT_REQUESTS");
  const { id: user_id, role: user_role } = useSelector(
    (state) => state.user.userProfile
  );

  const handleSubmit = async (data) => {
    try {
      if (data) {
        // Create a new FormData object
        const formData = new FormData();

        // Append the values to the FormData object
        formData.append("id", data.id);
        formData.append("clearance_report", data.clearance_report);
        if (DataList) {
          formData.append("status_resignation", "exit interview");
        } else {
          formData.append("status_termination", "exit interview");
        }
        const response = await saveEmployeeExitDetail(formData);
        if (response && reloadData) {
          reloadData();
        }
      }
    } catch (error) {
      console.error("Error updating application status:", error);
    }
  };

  const handleClick = (event, status, data) => {
    event.preventDefault();
    event.stopPropagation();
    handleSubmit(status, data);
  };

  const fetchData = async (id, isMounted) => {
    try {
      const response = await getEmployeeExitData(id);
      if (isMounted) {
        return response;
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const fields = React.useMemo(
    () => [
      {
        customContent: true,
        renderContent: (data) => {
          return (
            <div className="flex flex-wrap justify-between gap-2 items-center">
              <EmployeeOverview
                id={data.employee_id}
                howId={true}
                showEmail={true}
                avatarSize={14}
              />
              <StatusLabel className="ml-10" status={data.status}>
                {data?.status?.toLowerCase()}
              </StatusLabel>
            </div>
          );
        },
      },
      {
        title: "Employee Details",
        field: [
          {
            key: "employee_id",
            label: "",
            formatter: (cell) => (
              <EmployeeDetailUI
                id={cell}
                InformationKeys={[
                  "name",
                  "department",
                  "position",
                  "branch",
                  "manager",
                  "contact_no",
                  "joining_date",
                ]}
                ViewVariant={"vertical"}
                className
              />
            ),
          },
        ],
      },
      {
        title: `${isResignation ? "Resignation" : "Termination"} Details`,
        footerTitle: "Request At",
        footerField: "created_at",
        field: [
          {
            key: "id",
            label: "Id",
            formatter: (cell, row) => <FormatID value={cell} prefix={"EEC-"} />,
          },
          {
            key: isResignation ? "exit_type" : "reason_of_termination",
            label: "Reason for leaving",
            // formatter: (cell) => renderDate(cell),
          },
          {
            key: "notice_period",
            label: "Notice Period",
            // formatter: (cell) => renderDate(cell),
          },
          {
            key: "exit_date",
            label: "Exit date",
            formatter: (cell) => renderDate(cell, "--"),
          },
        ],
      },
      {
        title: `Exit Interview Details`,
        field: [
          {
            key: "exit_interviewer_name",
            label: "Interviewer Name",
          },
          {
            key: "exit_interview_date",
            label: "Interview date",
            formatter: (cell) => renderDate(cell, "--"),
          },
          {
            key: "exit_interview_notes",
            label: "Interview Notes",
          },
        ],
      },
      {
        title: `${isResignation ? "Resignation" : "Termination"} Letter`,
        field: [
          {
            key: isResignation ? "resignation_letter" : "termination_letter",
            formatter: (cell) =>
              cell ? (
                <AttachmentUI />
              ) : (
                <div className="text-neutral-1000 text-sm mt-2">
                  No letter attached
                </div>
              ),
          },
        ],
      },
      {
        title: "Approval Details",
        field: [
          {
            key: "approval_details",
            formatter: (cell) => (
              <StatusList status_list={cell} className="my-3" />
            ),
          },
        ],
      },
      {
        customContent: true,
        renderContent: (data) => {
          if (!managePermitted) return null;
          if (!data || !data.status || data.status?.toLowerCase() !== "pending")
            return null;
          if (!data.current_approver) return null;
          if (data.current_approver.includes(user_id) || user_role.includes(1))
            return (
              <div className="flex flex-wrap justify-end gap-2 my-5">
                <Button
                  variant="success"
                  onClick={(event) => handleClick(event, "Approved", data)}
                >
                  Approve
                </Button>
                <Button
                  variant="destructive"
                  onClick={(event) => handleClick(event, "Rejected", data)}
                >
                  Reject
                </Button>
              </div>
            );
          return null;
        },
      },
    ],
    [managePermitted, user_id, user_role, handleClick]
  );

  return (
    <>
      <NavigationSheetComponent
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title={`${isResignation ? "Resignation" : "Termination"} Details`}
        currentItem_Id={currentId}
        dataList={DataList}
        reloadData={reloadData}
        allowEdit={false}
        allowDelete={false}
        fetchCurrentItemDetails={fetchData}
        deleteItemName="name"
        editTooltip="Edit Grace Time"
        deleteTooltip="Delete Geace Time"
      >
        <DetailContent title="Adjustment Details" fields={fields} />
      </NavigationSheetComponent>
    </>
    // <Sheet open={isOpen} onOpenChange={setIsOpen}>
    //   <SheetContent side="right" className="w-full p-6 sm:max-w-4xl ">
    //     <div className="flex flex-col h-full">
    //       <SheetHeader>
    //         <ViewDetailHeader
    //           onNextClick={handleNext}
    //           onPreviousClick={handlePrevious}
    //         />
    //       </SheetHeader>
    //       <div className="mt-4">
    //         <section className="flex flex-col items-start justify-start w-full gap-4 mt-10 max-md:max-w-full">
    //           <StatusLabel>
    //             {DataList ? "Resignation" : "Termination"}
    //           </StatusLabel>
    //           <div className="flex flex-wrap items-center justify-between w-full">
    //             <div className="flex flex-col gap-2 justify-start max-w-[70%]">
    //               <EmployeeOverview
    //                 id={resignation?.employee_id}
    //                 showId={true}
    //                 showDepartment={true}
    //                 showPosition={true}
    //                 avatarSize={16}
    //               />
    //               {/* <h1 className="mb-0 text-2xl font-bold text-zinc-800">
    //                 {resignation?.emp_name}
    //               </h1>
    //               <p className="text-base text-zinc-600">
    //                 ID: <EmployeeID value={resignation?.employee_id} /> |{" "}
    //                 <DesignationName value={resignation?.position} /> |
    //                 <DepartmentName value={resignation?.department || resignation?.department_id || resignation?.department_name} />
    //               </p> */}
    //             </div>
    //             {DataList ? (
    //               <RenderResignationAction row={resignation} viewMode={true} />
    //             ) : (
    //               <RenderTerminationAction row={resignation} viewMode={true} />
    //             )}
    //           </div>
    //         </section>
    //         <section>
    //           <ViewDetailBox
    //             labelList={[
    //               {
    //                 label: "Joining date",
    //                 value: renderDate(resignation?.joining_date),
    //               },
    //               {
    //                 label: "Status",
    //                 value: DataList
    //                   ? ResignationStatus(resignation?.status_resignation)
    //                   : TerminationStatus(resignation?.status_termination),
    //               },
    //               {
    //                 label: "Report to",
    //                 value: <ManagerName value={resignation?.report_to} />,
    //               },
    //               {
    //                 label: "Reason for leaving",
    //                 value: DataList ? (
    //                   ResignationReason(resignation?.exit_type)
    //                 ) : (
    //                   <TerminationReason
    //                     value={resignation?.reason_of_termination}
    //                   />
    //                 ),
    //               },

    //               {
    //                 label: "Exit date",
    //                 value: renderDate(resignation?.exit_date)
    //               },

    //               {
    //                 label: "Notice Period",
    //                 value: resignation?.notice_period || "N/A",
    //               },
    //               {
    //                 label: "Phone no.",
    //                 value: `+${resignation?.country_code || ""}${
    //                   resignation?.mobile_no || ""
    //                 }`,
    //               },
    //             ]}
    //           />
    //           <ViewAttachmentDetail
    //             title={"Attachments"}
    //             attachments={[
    //               {
    //                 name: `${resignation?.emp_name} - ${
    //                   DataList ? "Resignation" : "Termination"
    //                 } letter`,
    //                 file: DataList
    //                   ? resignation?.resignation_letter
    //                   : resignation?.termination_letter,
    //               },
    //               {
    //                 name: `${resignation?.emp_name} - Clearance report`,
    //                 file: resignation?.clearance_report,
    //               },
    //             ]}
    //           />
    //         </section>
    //         {ExitStatusCurrentStep(
    //           DataList
    //             ? resignation?.status_resignation
    //             : resignation?.status_termination
    //         ) >= 3 &&
    //           !resignation?.clearance_report && (
    //             <section className="my-6">
    //               <Formik
    //                 initialValues={resignation}
    //                 innerRef={formRef}
    //                 enableReinitialize={true}
    //                 onSubmit={(values, { resetForm }) => {
    //                   handleSubmit(values, resetForm);
    //                 }}
    //                 validate={(values) => {
    //                   const errors = {};
    //                   if (!values.clearance_report) {
    //                     errors.clearance_report =
    //                       "Please upload clearance report to proceed";
    //                   }
    //                   return errors;
    //                 }}
    //               >
    //                 {(props) => (
    //                   <form onSubmit={props.handleSubmit}>
    //                     <CoverFileUpload
    //                       name="clearance_report"
    //                       label=" Clearance Report or drag it here"
    //                       acceptType=".pdf"
    //                       error={props.errors?.clearance_report}
    //                       touch={props.touched?.clearance_report}
    //                       value={props.values?.clearance_report}
    //                       required={true}
    //                       onChange={(field, value) => {
    //                         props.setFieldValue(field, value);
    //                       }}
    //                     />

    //                     <Button type="submit" variant="default">
    //                       Save
    //                     </Button>
    //                   </form>
    //                 )}
    //               </Formik>
    //             </section>
    //           )}
    //       </div>
    //     </div>
    //   </SheetContent>
    // </Sheet>
  );
};

export default ExitDetailsCard;
