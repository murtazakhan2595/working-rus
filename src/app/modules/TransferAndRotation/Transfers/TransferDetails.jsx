import React, { useState } from "react";
import {
    NavigationSheetComponent,
    DetailContent,
    StatusList,
} from "components";
// import AddGraceTimeForm from "./AddGraceTimeForm";
import { FormatID } from "utils/getValuesFromTables";
import { StatusLabel, EmployeeDetailUI } from "components";
import {
    getAttendancebyEmployee,
    saveAttendance,
} from "app/hooks/attendance";
import { getEmployeeTransferData } from 'app/hooks/transferAndRotation';
import { EmployeeOverview } from "components";
import { renderDate } from "utils/renderValues";
import { Button } from "components/ui/button";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { HasAccess } from "utils/PermissionUtils";
import { handleRequest } from "app/hooks/general";
import { saveCustomShift } from "app/hooks/shiftManagement";
import { ManagerName } from "utils/getValuesFromTables";
import { DepartmentName } from "utils/getValuesFromTables";
import { BranchName } from "utils/getValuesFromTables";

const TransferDetails = ({
    isOpen,
    setIsOpen,
    currentId,
    reloadData = () => { },
    DataList = [],
}) => {
    const managePermitted = HasAccess("MANAGE_TIME_ADJ_REQUESTS");
    const { id: user_id, role: user_role } = useSelector(
        (state) => state.user.userProfile
    );
    const [forceLoad, setForceLoad] = useState(false);

    const handleClick = async (
        event,
        status,
        {
            request,
            id,
            employee_id,
            date,
            shift_start_time,
            shift_end_time,
            is_second_shift,
        }
    ) => {
        event.preventDefault();
        event.stopPropagation();
        try {
            const response = await handleRequest(request, status === "Approved");
            if (response) {
                toast.success(`Request ${status} Successfully!`);
                if (status === "Approved") {
                    const { status: updatedStatus } = await fetchData(id, true);
                    if (updatedStatus && updatedStatus.toLowerCase() === "approved") {
                        await saveCustomShift(
                            employee_id,
                            date,
                            shift_start_time,
                            shift_end_time,
                            is_second_shift,
                            user_id
                        );
                        const { id } = await getAttendancebyEmployee(employee_id, date);
                        if (id) await saveAttendance({ status: "Present" }, null, id);
                    }
                }
                setForceLoad(!forceLoad);
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
                    <div className="flex flex-wrap justify-between gap-2 flex-wrap items-center">
                        <EmployeeOverview
                            id={data.employee_id}
                            showId={true}
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
                            ]}
                            ViewVariant={"vertical"}
                        />
                    ),
                },
            ],
        },
        {
            title: "Transfer Details",
            footerTitle: "Submitted At",
            footerField: "created_at",
            field: [
                {
                    key: "transfer_type",
                    label: "Transfer Type",
                    formatter: (cell) => <span className="capitalize-text">{cell.toLowerCase()}</span>
                },
                {
                    key: "new_branch",
                    label: "New Branch",
                    formatter: (cell) => <BranchName value={cell} />
                },
                {
                    key: "new_department",
                    label: "New Department",
                    formatter: (cell) => <DepartmentName value={cell} />
                },
                {
                    key: "new_reporting_manager",
                    label: "New Reporting Manager",
                    formatter: (cell) => <ManagerName value={cell} />,
                },
                {
                    key: "effective_transfer_date",
                    label: "Effective Date",
                    formatter: (cell) => renderDate(cell, "--"),
                },
                {
                    key: "reason_of_transfer",
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
    ];

    const fetchData = async (id, isMounted) => {
        try {
            const response = await getEmployeeTransferData(id);
            if (isMounted) {
                return response;
            }
        } catch (error) {
            console.error("Error fetching roles:", error);
        }
    };

    return (
        <NavigationSheetComponent
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title="Transfer Details"
            currentItem_Id={currentId}
            ForceItemLoad={forceLoad}
            dataList={DataList}
            reloadData={reloadData}
            allowEdit={false}
            allowDelete={false}
            fetchCurrentItemDetails={fetchData}
            deleteItemName="name"
            editTooltip="Edit Grace Time"
            deleteTooltip="Delete Geace Time"
        >
            <DetailContent title="Adjustment Time Details" fields={fields} />
        </NavigationSheetComponent>
    );
};

export default TransferDetails;
