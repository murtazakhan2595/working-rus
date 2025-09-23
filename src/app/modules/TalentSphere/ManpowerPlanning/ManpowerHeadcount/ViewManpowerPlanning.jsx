import React from "react";
import { NavigationSheetComponent } from "components";
import { DetailContent } from "components";
import { AddUpdateManpower } from "app/modules/TalentSphere";
import { BudgetStatusOptions } from "data/Data";
import { getManpowerById } from "app/hooks/talentSphere";
import { DepartmentName, FormatID, BranchName } from "utils/getValuesFromTables";
import { getConsumedBudgetStatus } from 'app/utils/MappingObjects/mapTalentSphere';

const ViewManpowerPlanning = ({
    isOpen,
    setIsOpen,
    currentId,
    reloadData = () => { },
    DataList = [],
}) => {
    // Define the fields to display
    const fields = [
        {
            title: "Manpower Details",
            footerTitle: "Created At",
            footerField: "created_on",
            field: [
                {
                    key: "id",
                    label: "Id",
                    formatter: (cell) => <FormatID value={cell} prefix={"MP-"} />,
                },
                { key: "fiscal_year", label: "Fiscal Year" },
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
                    key: "planned_headcount",
                    label: "Planned Headcount",
                },
                {
                    key: "existing_headcount",
                    label: "Existing Headcount",
                },
                {
                    key: "total_allocated_budget",
                    label: "Total Allocated Budget",
                },
                {
                    key: "consumed_budget",
                    label: "Consumed Budget",
                },
                {
                    key: "consumed_percentage",
                    label: "Consumed Budget Percentage",
                },
                {
                    key: "consumed_percentage",
                    label: "Consumed Budget Status",
                    formatter: (cell) => {
                        const status = getConsumedBudgetStatus(parseFloat(cell || 0));
                        return (BudgetStatusOptions.find(obj => obj.value === status) || {}).label || '--';
                    },
                },
                {
                    key: "justification",
                    label: "Justification",
                },
                {
                    key: "created_by",
                    label: "Created By",
                },
            ],
        },
    ];

    const fetchData = async (id, isMounted) => {
        try {
            const response = await getManpowerById(id);
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
            title="Manpower Planning Details"
            currentItem_Id={currentId}
            dataList={DataList}
            reloadData={reloadData}
            editComponent={AddUpdateManpower}
            apiEndpoint={"/manpower-plans/${id}/"}
            fetchCurrentItemDetails={fetchData}
            deleteItemName="name"
            editTooltip="Edit Manpower Planning"
            deleteTooltip="Delete Manpower Planning"
            editPermissions="EDIT_MANPOWER"
            deletePermissions="DELETE_MANPOWER"
        >
            <DetailContent fields={fields} />
        </NavigationSheetComponent>
    );
};

export default ViewManpowerPlanning;
