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
                            {data?.status?.toLowerCase()}
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
                    key: "new_department",
                    label: "Evaluation Type",
                },
                {
                    key: "new_designation",
                    label: "Evaluation Period",
                },
                {
                    key: "evaluated_by",
                    label: "Manager Name",
                    formatter: (cell) => <EmployeeName value={cell} />
                },
                {
                    key: "new_reporting_manager",
                    label: "Approval Date",
                    formatter: (cell) => renderDate(cell),
                },
                {
                    key: "rotation_cap_time",
                    label: "Final Rating & Score",
                    formatter: (cell) => `${cell} Day('s)`,
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
                    key: "",
                    label: 'Scores'
                },
                {
                    key: "",
                    label: 'Manager Comments'
                },
            ],
        },
        {
            title: "Overall Summary",
            field: [
                {
                    key: "",
                    label: 'Final Rating'
                },
                {
                    key: "",
                    label: 'Weightage applied'
                },
                {
                    key: "",
                    label: 'HR remarks'
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
