import React, { useState } from "react";
import { NavigationSheetComponent, EmployeeOverview } from "components";
import { DetailContent } from "components";
import { AddUpdateMyGoals } from "app/modules/PerformanceEdge";
import { FormatID } from "utils/getValuesFromTables";
import { toast } from "react-toastify";
import { StatusLabel } from "components";
import { getEmployeeGoalsById, saveEmployeeGoals } from "app/hooks/performanceEdge";
import { renderDate } from "utils/renderValues";
import { HasAccess } from "utils/PermissionUtils";
import { useSelector } from "react-redux";
import { Button } from "components/ui/button";

const ViewMyGoalsDetails = ({
    isOpen,
    setIsOpen,
    currentId,
    reloadData = () => { },
    DataList = [],
    managerView = false,
}) => {
    const managePermitted = HasAccess("MANAGE_TIME_ADJ_REQUESTS");
    const { id: user_id, role: user_role } = useSelector(
        (state) => state.user.userProfile
    );
    const [forceLoad, setForceLoad] = useState(false);

    const handleClick = async (event, status, { id, }) => {
        event.preventDefault();
        event.stopPropagation();
        try {
            const response = await saveEmployeeGoals({ id: id });
            if (response) {
                toast.success(`Goal ${status} Successfully!`);
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
                        <EmployeeOverview id={data.employee} showId={true} showEmail={true} />
                        <StatusLabel className="ml-10" status={data.status}>
                            {data?.status?.replace('_', ' ')?.toLowerCase()}
                        </StatusLabel>
                    </div>
                );
            },
        },
        {
            title: "Goals Details",
            field: [
                {
                    key: "id",
                    label: "Id",
                    formatter: (cell, row) => <FormatID value={cell} prefix={"MYG-"} />,
                },
                { key: "title", label: "Goal Title" },
                {
                    key: "due_date",
                    label: "Due Date",
                    formatter: (cell) => renderDate(cell),
                },
                {
                    key: "alignment",
                    label: "Alignment",
                    formatter: (cell) => <div className="text-capitalize">{cell}</div>,
                },
                {
                    key: "description",
                    label: "Description",
                },
            ],
        },
        {
            customContent: true,
            renderContent: (data) => {
                const key_results = data.key_results || [];
                const key_results_fields = [
                    {
                        title: "Key Results",
                        field: [
                            {
                                key: "description",
                                label: "Description",
                            },
                            {
                                key: "target_value",
                                label: "Target Value",
                            },
                            {
                                key: "current_value",
                                label: "Current Value",
                            },
                        ],
                    },
                ];
                return key_results.map(key_result => {
                    return <DetailContent fields={key_results_fields} currentItem={key_result} />
                })

            },
        },
        {
            customContent: true,
            renderContent: (data) => {
                if (!managerView) return <></>;
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
            if (id) {
                const response = await getEmployeeGoalsById(id);
                if (isMounted) {
                    return response;
                }
            }
        } catch (error) {
            console.error("Error fetching roles:", error);
        }
    };

    return (
        <NavigationSheetComponent
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title="My Goals Details"
            ForceItemLoad={forceLoad}
            currentItem_Id={currentId}
            dataList={DataList}
            reloadData={reloadData}
            editComponent={AddUpdateMyGoals}
            apiEndpoint={"/EmployeeGoal/${id}/"}
            fetchCurrentItemDetails={fetchData}
            deleteItemName="name"
            allowDelete={false}
            allowaEdit={!managerView}
            editTooltip="Edit My Goals"
        >
            <DetailContent fields={fields} />
        </NavigationSheetComponent>
    );
};

export default ViewMyGoalsDetails;
