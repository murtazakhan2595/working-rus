import React from "react";
import { NavigationSheetComponent } from "components";
import { DetailContent } from "components";
import { CreateUpdateCycleForm } from "app/modules/PerformanceEdge";
import { FormatID } from "utils/getValuesFromTables";
import { BranchName } from "utils/getValuesFromTables";
import { StatusLabel } from "components";
import { getPerformanceCycleById } from "app/hooks/performanceEdge";
import { renderDate } from "utils/renderValues";
const PerformanceCycleDetails = ({
    isOpen,
    setIsOpen,
    currentId,
    reloadData = () => { },
    DataList = [],
}) => {
    // Define the fields to display
    const fields = [
        {
            title: "Cycle Details",
            field: [
                {
                    key: "id",
                    label: "Id",
                    formatter: (cell, row) => <FormatID value={cell} prefix={"PC-"} />,
                },
                { key: "name", label: "Name" },
                {
                    key: "forms",
                    label: "Evaluation Forms",
                },
                {
                    key: "review_start",
                    label: "Review Period",
                    formatter: (cell, row) => `${renderDate(cell)} - ${renderDate(row.review_end)}`,
                },
            ],
        },
    ];

    const fetchData = async (id, isMounted) => {
        try {
            const response = await getPerformanceCycleById(id);
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
            title="Performance Cycle Details"
            currentItem_Id={currentId}
            dataList={DataList}
            reloadData={reloadData}
            editComponent={CreateUpdateCycleForm}
            apiEndpoint={"/cycles/${id}/"}
            fetchCurrentItemDetails={fetchData}
            deleteItemName="name"
            editTooltip="Edit Performance Cycle"
            deleteTooltip="Delete Performance Cycle"
        >
            <DetailContent fields={fields} />
        </NavigationSheetComponent>
    );
};

export default PerformanceCycleDetails;
