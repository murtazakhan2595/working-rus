import React, { useState } from "react";
import {
    NavigationSheetComponent,
    DetailContent,
    StatusList,
} from "components";
import { FormatID, BranchName, DepartmentName } from "utils/getValuesFromTables";
import { StatusLabel, SheetUI, MultiStatusLabel, StatusButtons, EmployeeDetailUI } from "components";
import { getRequisitionRequestData } from "app/hooks/talentSphere";
import { getActiveShiftData } from "app/hooks/shiftManagement";
import { handleRequest } from "app/hooks/general";
import AttachmentUI from "components/ui/AttachmentUI";
import { toast } from "react-toastify";
import { saveUpdateAttendanceAdjustment } from "app/hooks/attendance";
import { TextAreaInput } from "components/FormControl";
import { getAttendanceData } from "app/hooks/attendance";
import { saveAttendance } from "app/hooks/attendance";

const FormSheetData = {
    triggerText: "Submit",
    title: "Reject Attendance Update Request",
    description: null,
    footer: null,
    className: "max-w-[478px] w-full h-[400px]",
};
const ViewRequisitionRequest = ({
    isOpen,
    setIsOpen,
    currentId,
    reloadData = () => { },
    DataList = [],
    isTeamView = false,
}) => {
    const [forceLoad, setForceLoad] = useState(false);
    const [openRejectModal, setOpenRejectModal] = useState(false);
    const [RejectedData, setRejectData] = useState(false);
    const handleSubmit = async (
        status,
        {
            employee,
            id,
            rejection_reason,
            request_id,
            requested_checkout,
            requested_checkin,
            is_second_shift,
            attendance_date,
        }
    ) => {
        try {
            const response = await handleRequest(request_id, status === "Approved");
            // return
            if (response) {
                toast.success(`Request ${status} Successfully!`);
                if (status === "Rejected") {
                    await saveUpdateAttendanceAdjustment(
                        { rejection_reason: rejection_reason },
                        id
                    );
                }
                const { status: updatedStatus, attendance } = await fetchData(id, true);
                if (updatedStatus && updatedStatus.toLowerCase() === "approved") {
                    const attendanceData = attendance
                        ? await getAttendanceData(attendance)
                        : {};
                    const shiftData = await getActiveShiftData(employee, attendance_date);
                    const payload = {
                        ...attendanceData,
                        date: attendance_date,
                        id: attendance,
                        ...(is_second_shift
                            ? { second_checkin: requested_checkin }
                            : { checkin: requested_checkin }),
                        ...(is_second_shift
                            ? { second_checkout: requested_checkout }
                            : { checkout: requested_checkout }),
                        employee_id: employee,
                    };
                    await saveAttendance(payload, shiftData, attendance);
                }
                setForceLoad(!forceLoad);
                setOpenRejectModal(false);
                setRejectData(null);
            }
        } catch (error) {
            // Handle errors and rollback form data
            console.error(error);
        }
    };
    // Define the fields to display
    const fields = [
        {
            customContent: true,
            renderContent: (data) => {
                return (
                    <div className="flex flex-wrap justify-end gap-2 items-center flex-wrap">
                        <StatusLabel className="ml-10" status={data.status}>
                            {data?.status?.toLowerCase()}
                        </StatusLabel>
                    </div>
                );
            },
        },
        {
            title: "Requestor Details",
            field: [
                {
                    key: "requested_by",
                    label: "",
                    formatter: (cell) => (<EmployeeDetailUI id={cell} InformationKeys={["name", "department", "position", "branch",]} ViewVariant={"vertical"} />),
                },
            ],
        },
        {
            title: "Job Details",
            footerTitle: "Request At",
            footerField: "created_at",
            field: [
                {
                    key: "id",
                    label: "Id",
                    formatter: (cell, row) => <FormatID value={cell} prefix={"RR-"} />,
                },
                {
                    key: "branch",
                    label: "Branch",
                    formatter: (cell) => <BranchName value={cell} />,
                },
                {
                    key: "department",
                    label: "Department",
                    formatter: (cell) => <DepartmentName value={cell} />,
                },
             
                {
                    key: "job_title",
                    label: "Job Title",
                },
                {
                    key: "job_description",
                    label: "Job Description",
                },
                {
                    key: "required_skills",
                    label: "Required Skills",
                },
            ],
        },
        {
            title: "Work Mode Details",
            field: [
                {
                    key: "work_mode",
                    label: "Work Mode",
                },
                {
                    key: "remote_work_checklist_name",
                    label: "Remote Work Checklist",
                    formatter: (cell) => <MultiStatusLabel statusList={cell} variant="info" displayAll={true} />
                },
                {
                    key: "country",
                    label: "Country",
                },
                {
                    key: "city",
                    label: "City",
                },
                   {
                    key: "is_emiratization_role",
                    label: "Emiratization Role",
                    formatter: (cell) => cell ? 'Required' : 'Not Required',
                },
            ],
        },
        {
            title: "Compensation & Benefits",
            field: [
                {
                    key: "benefit_names",
                    label: "Benefits",
                    formatter: (cell) => cell && cell.length > 0 ? <MultiStatusLabel statusList={cell} variant="info" displayAll={true} /> : <div>Not enabled</div>
                },
            ],
        },
        {
            title: "Job Specification Details",
            field: [
                {
                    key: "number_of_positions",
                    label: "Number of Positions",
                },
                {
                    key: "job_type_name",
                    label: "Job Type",
                },
                {
                    key: "gender_preference",
                    label: "Gender Preference",
                    formatter: (cell) => <div className="text-capitalize">{cell}</div>,
                },
                {
                    key: "min_age",
                    label: "Age Limit",
                    formatter: (cell, data) => `${cell} Years - ${data.max_age} Years`,
                },
                {
                    key: "education",
                    label: "Education Requirement",
                },
                {
                    key: "career_level_name",
                    label: "Career Level",
                },
                {
                    key: "experience_min",
                    label: "Experiance",
                    formatter: (cell, data) => `${cell} Years - ${data.experience_max} Years`,
                },
                {
                    key: "salary_min",
                    label: "Salary Range",
                    formatter: (cell, data) => `${cell} - ${data.salary_max}`,
                },
                {
                    key: "justification",
                    formatter: (cell) => <MultiStatusLabel statusList={cell} variant="info" displayAll={true} />,
                    label: "Justification",
                },
            ],
        },
        {
            title: `Attachment`,
            field: [
                {
                    key: 'attachment',
                    formatter: (cell, data) =>
                        cell ? (
                            <AttachmentUI
                                attachment={cell}
                                name={`Requisition Request Document`}
                                viewOnly={true}
                            />
                        ) : (
                            <div className="text-neutral-1000 text-sm">No document attached</div>
                        ),
                },
            ],
        },
        {
            title: "Approval Details",
            field: [
                {
                    key: "approval_details",
                    formatter: (cell, data) => {
                        if (!data.approval_required) return 'Approval was not required';
                        return (<StatusList status_list={cell} className="my-3" />)
                    },
                },
            ],
        },
        {
            customContent: true,
            renderContent: (data) => {
                if (isTeamView) return null;
                return (
                    <StatusButtons
                        permissionKey={'MANAGE_HEADCOUNT_REQUESTS'}
                        status={data?.status}
                        current_approver={data.current_approver}
                        final_approver={data.final_approvers || []}
                        request_id={data.hierarchy_request}
                        RejectionConfig={{ label: 'Rejection Reason', required: true }}
                        setResponse={(response) => {
                            if (response) {
                                setForceLoad(!forceLoad);
                            }
                        }}
                    />
                );
            },
        },
    ];

    const fetchData = async (id, isMounted) => {
        try {
            const response = await getRequisitionRequestData(id);
            if (isMounted) {
                return response;
            }
        } catch (error) {
            console.error("Error fetching roles:", error);
        }
    };

    return (
        <>
            <NavigationSheetComponent
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                title="Requisition Details"
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
            {openRejectModal && (
                <SheetUI
                    isOpen={openRejectModal}
                    setIsOpen={setOpenRejectModal}
                    variant="modal"
                    sheetConfig={FormSheetData}
                    formConfig={{
                        initialValues: RejectedData,
                        enableReinitialize: true,
                        handleSubmit: (data) => {
                            handleSubmit("Rejected", data);
                        },
                        validateFormSchema: (values) => {
                            const error = {};
                            if (!values.rejection_reason)
                                error.rejection_reason = "Reason is required";
                            return error;
                        },
                        submitButtonText: "Submit",
                        cancelButtonText: "Cancel",
                        columns: 1,
                        formFields: [
                            {
                                sheetCardExtension: false,
                                sheetCardTitle: "Attendance Details",
                                InputFields: [
                                    {
                                        InputField: TextAreaInput,
                                        name: "rejection_reason",
                                        required: true,
                                        label: "Rejection Reson",
                                        rows: 3,
                                    },
                                ].filter(Boolean),
                            },
                        ],
                    }}
                ></SheetUI>
            )}
        </>
    );
};

export default ViewRequisitionRequest;
