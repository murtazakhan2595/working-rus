import React from "react";
import {
    NavigationSheetComponent,
    DetailContent,
} from "components";
import { getMyPerformanceFormsById } from 'app/hooks/performanceEdge';
import { StatusLabel } from "components";
import { EmployeeOverview } from "components";
import { renderDate } from "utils/renderValues";
import { useSelector } from "react-redux";
import { EmployeeName } from "utils/getValuesFromTables";


const PerformanceResultDetails = ({
    isOpen,
    setIsOpen,
    currentId,
    reloadData = () => { },
    DataList = [],
}) => {
    const { id: user_id } = useSelector((state) => state.user.userProfile);

    // Define the fields to display
    const fields = [
        {
            customContent: true,
            renderContent: (data) => {
                return (
                    <div className="flex flex-wrap justify-between gap-2 items-center flex-wrap">
                        <EmployeeOverview
                            id={user_id}
                            showId={true}
                            showEmail={true}
                            avatarSize={16}
                        />
                        <StatusLabel className="ml-10" status={data.status}>
                            {data?.Final_Ratng?.status?.toLowerCase()}
                        </StatusLabel>
                    </div>
                );
            },
        },
        {
            title: "Evaluation Details",
            // footerTitle: "Request At",
            // footerField: "created_at",
            field: [
                {
                    key: "name",
                    label: "Evaluation Type",
                },
                {
                    key: "review_start",
                    label: "Evaluation Period",
                    formatter: (cell, row) => (<div><span>{renderDate(cell, '--')}</span> to <span>{renderDate(row.review_end, '--')}</span> </div>),
                },
                {
                    key: "evaluated_by",
                    label: "Manager Name",
                    formatter: (cell) => <EmployeeName value={cell} />
                },
                {
                    key: "Final_Ratng",
                    label: "Approval Date",
                    formatter: (cell) => renderDate(cell?.hr_approval_date),
                },
                {
                    key: "Final_Ratng",
                    label: "Final Rating",
                    formatter: (cell) => cell?.final_rating,
                },
                {
                    key: "Final_Ratng",
                    label: "Final Score",
                    formatter: (cell) => cell?.final_score,
                },
            ],
        },
        {
            title: "Self Assessment Summary",
            field: [
                {
                    key: "",
                    label: 'Assessment Details'
                },
                {
                    key: "",
                    label: 'Submitted Date'
                },
                {
                    key: "",
                    label: 'Comments'
                },
            ],
        },
        {
            title: "Peer Assessment Summary",
            field: [
                {
                    key: "",
                    label: 'Peer Name'
                },
                {
                    key: "",
                    label: 'Peer Score'
                },
                {
                    key: "",
                    label: 'Peer Comment'
                },
            ],
        },
        {
            title: "Manager Assessment",
            field: [
                {
                    key: "Final_Ratng",
                    label: 'Scores',
                    formatter: (cell) => cell?.manager_assessment?.score,
                },
                {
                    key: "Final_Ratng",
                    label: 'Manager Comments',
                    formatter: (cell) => cell?.manager_assessment?.final_comments,
                },
            ],
        },
        {
            title: "Overall Summary",
            field: [
                {
                    key: "Final_Ratng",
                    label: 'Final Rating',
                    formatter: (cell) => cell?.overall_summary?.system_generated_rating,
                },
                {
                    key: "Final_Ratng",
                    label: 'Weightage applied',
                    formatter: (cell) => cell?.overall_summary?.final_comments,
                },
                {
                    key: "Final_Ratng",
                    label: 'HR remarks',
                    formatter: (cell) => cell?.overall_summary?.hr_remarks,
                },
            ],
        },
    ];

    const fetchData = async (id, isMounted) => {
        try {
            const response = await getMyPerformanceFormsById(id);
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
                title="Evaluation Result Details"
                currentItem_Id={currentId}
                dataList={DataList}
                reloadData={reloadData}
                allowEdit={false}
                allowDelete={false}
                fetchCurrentItemDetails={fetchData}

            >
                <DetailContent fields={fields} />
            </NavigationSheetComponent>
        </>
    );
};

export default PerformanceResultDetails;
