import React from "react";
import { NavigationSheetComponent } from "components";
import { DetailContent } from "components";
import { AddUpdateMyGoals } from "app/modules/PerformanceEdge";
import { FormatID } from "utils/getValuesFromTables";
import { BranchName } from "utils/getValuesFromTables";
import { StatusLabel } from "components";
import { getEmployeeGoalsById } from "app/hooks/performanceEdge";
import { renderDate } from "utils/renderValues";
const ViewMyGoalsDetails = ({
    isOpen,
    setIsOpen,
    currentId,
    reloadData = () => { },
    DataList = [],
}) => {
    // Define the fields to display
    const fields = [
        {
            customContent: true,
            renderContent: (data) => {
                return (
                    <div className="flex flex-wrap justify-end gap-2 flex-wrap items-center">
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
            currentItem_Id={currentId}
            dataList={DataList}
            reloadData={reloadData}
            editComponent={AddUpdateMyGoals}
            apiEndpoint={"/EmployeeGoal/${id}/"}
            fetchCurrentItemDetails={fetchData}
            deleteItemName="name"
            allowDelete={false}
            editTooltip="Edit My Goals"
        >
            <DetailContent fields={fields} />
        </NavigationSheetComponent>
    );
};

export default ViewMyGoalsDetails;
