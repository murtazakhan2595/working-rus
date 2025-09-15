import React, { useState } from "react";
import { NavigationSheetComponent, EmployeeOverview } from "components";
import { DetailContent } from "components";
import { AddUpdateMyGoals } from "app/modules/PerformanceEdge";
import { FormatID } from "utils/getValuesFromTables";
import { toast } from "react-toastify";
import { StatusLabel } from "components";
import { getFormQuestions, saveEmployeeGoals } from "app/hooks/performanceEdge";
import { renderDate } from "utils/renderValues";
import { HasAccess } from "utils/PermissionUtils";
import { useSelector } from "react-redux";
import { Button } from "components/ui/button";

const ViewSelfAssessment = ({
    isOpen,
    setIsOpen,
    form_id,
    cycle_id,
    reloadData = () => { },
}) => {
    const managePermitted = HasAccess("MANAGE_TEAM_GOAL");
    const { id: user_id, role: user_role } = useSelector(
        (state) => state.user.userProfile
    );
    const [forceLoad, setForceLoad] = useState(false);

    const handleClick = async (event, status, { id, }) => {
        event.preventDefault();
        event.stopPropagation();
        try {
            const response = await saveEmployeeGoals({ id: id, aprroval_status: status });
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
                        <StatusLabel className="ml-10" status={data.status}>
                            {data?.submissions?.status?.replace('_', ' ')?.toLowerCase()}
                        </StatusLabel>
                    </div>
                );
            },
        },
        {
            title: "Assessment Details",
            field: [
                {
                    key: "name",
                    label: "Name",
                },
                {
                    key: "review_start",
                    label: "Review Period",
                    formatter: (cell, row) => (<div><span>{renderDate(cell, '--')}</span> to <span>{renderDate(row.review_end, '--')}</span> </div>),
                },
                {
                    key: "submitted_at",
                    label: "Submission Date",
                    formatter: (cell) => renderDate(cell, '--')
                },
            ],
        },
        {
            customContent: true,
            renderContent: (data) => {
                const sections = data.sections || [];
                const fields = data.sections?.fields || [];
                const sections_fields = [
                    {
                        title: "Field Sections",
                        field: [
                            {
                                key: "name",
                                label: "Name",
                            },
                            ...(fields
                                ? fields.map((field, fieldIndex) => ([
                                    {
                                        key: "question",
                                        label: "Name",
                                        formatter: () => <div>{field.question}</div>
                                    },
                                ])).flat()
                                : []
                            ),
                            {
                                customContent: true,
                                renderContent: (data) => {
                                    debugger
                                    const fields = data.sections?.fields || [];
                                    const fields_fields = [
                                        {
                                            title: "Field Sections",
                                            field: [
                                                {
                                                    key: "name",
                                                    label: "Name",
                                                },
                                            ],
                                        },
                                    ];
                                    return fields.map((field, index) => {
                                        return <div>
                                            <div>{index + 1}. {field.question}</div>
                                        </div>
                                    })

                                },
                            },
                        ],
                    },
                ];
                return sections.map(section => {
                    return <DetailContent fields={sections_fields} currentItem={section} />
                })

            },
        },
    ];

    const fetchData = async (id, isMounted) => {
        try {
            if (id) {
                const response = await getFormQuestions(id, cycle_id);
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
            title="Assessment Details"
            ForceItemLoad={forceLoad}
            currentItem_Id={form_id}
            dataList={[]}
            reloadData={reloadData}
            fetchCurrentItemDetails={fetchData}
            deleteItemName="name"
            allowDelete={false}
            allowEdit={false}
        >
            <DetailContent fields={fields} />
        </NavigationSheetComponent>
    );
};

export default ViewSelfAssessment;
