import React, { useState } from "react";
import {
    NavigationSheetComponent,
    DetailContent,
    StatusList,
    EmployeeDetailUI,
} from "components";
import { saveJobRotation, getJobRotationById } from 'app/hooks/transferAndRotation';
// import AddGraceTimeForm from "./AddGraceTimeForm";
import { FormatID } from "utils/getValuesFromTables";
import { StatusLabel, SheetUI } from "components";
import { getAttendanceAdjustmentData } from "app/hooks/attendance";
import { getActiveShiftData } from "app/hooks/shiftManagement";
import { handleRequest } from "app/hooks/general";
import { EmployeeOverview } from "components";
import { renderDate } from "utils/renderValues";
import { Button } from "components/ui/button";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { saveUpdateAttendanceAdjustment } from "app/hooks/attendance";
import { TextAreaInput } from "components/FormControl";
import { HasAccess } from "utils/PermissionUtils";
import { getAttendanceData } from "app/hooks/attendance";
import { saveAttendance } from "app/hooks/attendance";
import { DepartmentName } from "utils/getValuesFromTables";
import { ManagerName } from "utils/getValuesFromTables";
import { BranchName } from "utils/getValuesFromTables";
import { DesignationName } from "utils/getValuesFromTables";
import { Day } from "react-day-picker";

const FormSheetData = {
    triggerText: "Submit",
    title: "Reject Attendance Update Request",
    description: null,
    footer: null,
    className: "max-w-[478px] w-full h-[400px]",
};
const JobRotationDetails = ({
    isOpen,
    setIsOpen,
    currentId,
    reloadData = () => { },
    DataList = [],
}) => {
    const managePermitted = HasAccess("MANAGE_ATTENDANCE_ADJ_REQUESTS");
    const { id: user_id, role: user_role } = useSelector(
        (state) => state.user.userProfile
    );
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
    const handleClick = (event, status, data) => {
        event.preventDefault();
        event.stopPropagation();
        handleSubmit(status, data);
    };
    const handleRejectClick = (event, data) => {
        event.preventDefault();
        event.stopPropagation();
        setOpenRejectModal(true);
        setRejectData(data);
    };
    // Define the fields to display
    const fields = [
        {
            customContent: true,
            renderContent: (data) => {
                return (
                    <div className="flex flex-wrap justify-between gap-2 items-center flex-wrap">
                        <EmployeeOverview
                            id={data.employee}
                            showId={true}
                            showEmail={true}
                            avatarSize={16}
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
                    key: "employee",
                    label: "",
                    formatter: (cell) => (
                        <EmployeeDetailUI
                            id={cell}
                            InformationKeys={[
                                "name",
                            ]}
                            ViewVariant={"vertical"}
                            className
                        />
                    ),
                },
                {
                    key: "old_department",
                    label: "Current Department",
                    formatter: (cell) => (<DepartmentName value={cell} />),
                },
                {
                    key: "old_designation",
                    label: "Current Designation",
                    formatter: (cell) => (<DesignationName value={cell} />),
                },
                {
                    key: "old_branch",
                    label: "Current Branch",
                    formatter: (cell) => (<BranchName value={cell} />),
                },
                {
                    key: "old_reporting_manager",
                    label: "Current Manager",
                    formatter: (cell) => (<ManagerName value={cell} />),
                },
            ],
        },
        {
            title: "Job Rotation Details",
            footerTitle: "Request At",
            footerField: "created_at",
            field: [
                {
                    key: "id",
                    label: "Id",
                    formatter: (cell, row) => <FormatID value={cell} prefix={"JR-"} />,
                },
                {
                    key: "new_department",
                    label: "Requested Department",
                    formatter: (cell) => (<DepartmentName value={cell} fallBackText={'--'} />),
                },
                {
                    key: "new_designation",
                    label: "Requested Designation",
                    formatter: (cell) => (<DesignationName value={cell} fallBackText={'--'} />),
                },
                {
                    key: "new_branch",
                    label: "Requested Branch",
                    formatter: (cell) => (<BranchName value={cell} fallBackText={'--'} />),
                },
                {
                    key: "new_reporting_manager",
                    label: "Requested Manager",
                    formatter: (cell) => (<ManagerName value={cell} fallBackText={'--'} />),
                },
                {
                    key: "rotation_cap_time",
                    label: "Cap Time",
                    formatter: (cell) => `${cell} Day('s)`,
                },
                {
                    key: "effective_date",
                    label: "Effective Date",
                    formatter: (cell) => renderDate(cell, '--'),
                },
                {
                    key: "rotation_type",
                    label: "Rotation Type",
                    formatter: (cell) => <span className="text-capitalize">{cell}</span>,
                },
                {
                    key: "rotation_expiry_date",
                    label: "Expiry Date",
                    formatter: (cell) => renderDate(cell, '--'),
                },
                {
                    key: "custom_reason",
                    label: "Reason",
                },
                {
                    key: "notes",
                    label: "Notes",
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
                console.log(data)
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
                                onClick={(event) => handleRejectClick(event, data)}
                            >
                                Reject
                            </Button>
                        </div>
                    );
                return null;
            },
        },
    ];

    const fetchData = async (id, isMounted) => {
        try {
            const response = await getJobRotationById(id);
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
                title="Job Rotation Details"
                currentItem_Id={currentId}
                ForceItemLoad={forceLoad}
                dataList={fetchData}
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

export default JobRotationDetails;
