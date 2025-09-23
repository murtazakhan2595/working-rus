import React, { useState } from "react";
import {
    NavigationSheetComponent,
    DetailContent,
    StatusList,
} from "components";
import { FormatID, BranchName } from "utils/getValuesFromTables";
import { StatusLabel, SheetUI, StatusButtons } from "components";
import { getHeadcountRequestData } from "app/hooks/talentSphere";
import { getActiveShiftData } from "app/hooks/shiftManagement";
import { handleRequest } from "app/hooks/general";
import { renderDate } from "utils/renderValues";
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
const ViewHeadCountRequests = ({
    isOpen,
    setIsOpen,
    currentId,
    reloadData = () => { },
    DataList = [],
    ViewMode=false,
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
            title: "Request Details",
            footerTitle: "Request At",
            footerField: "requested_on",
            field: [
                {
                    key: "id",
                    label: "Id",
                    formatter: (cell, row) => <FormatID value={cell} prefix={"HCR-"} />,
                },
                {
                    key: "branch",
                    label: "Branch",
                    formatter: (cell) => <BranchName value={cell} />,
                },
                {
                    key: "department_name",
                    label: "Department",
                },

                {
                    key: "attachment_url",
                    label: "Attachment",
                },
                {
                    key: "requested_by_name",
                    label: "Requested By",
                },
                {
                    key: "reason",
                    label: "Reason for Request",
                },
            ],
        },
        {
            title: "Headcount Details",
            field: [
                {
                    key: "allocated_headcount",
                    label: "Allocated",
                },
                {
                    key: "consumed_headcount",
                    label: "Consumed",
                },
                {
                    key: "remaining_headcount",
                    label: "Remaining",
                },
                {
                    key: "requested_headcount",
                    label: "Requested Additional",
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
                if(ViewMode) return null;
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
            const response = await getHeadcountRequestData(id);
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
                title="Headcount Request Details"
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

export default ViewHeadCountRequests;
