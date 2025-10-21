import React, { useState } from "react";
import { getInterviewFeedbackList } from "app/hooks/talentSphere";
import {
    NavigationSheetComponent,
    DetailContent,
    EmployeeDetailUI,
} from "components";
import { GetDispatchStateList } from "utils/Lists";

const ViewInterviewFeedback = ({
    currentId,
    DataList = [],
    reloadData = () => { },
    isOpen,
    setIsOpen = () => { },
    isTeamView = false,
}) => {
    const [CurrentData, setCurrentData] = useState([]);
    const { id: user_id } = GetDispatchStateList("userProfile", "user");
    const fetchData = async (id, isMounted) => {
        try {
            const response = await getInterviewFeedbackList({ filterData: { interview: id, ...(isTeamView ? { panel_member: [user_id] } : {}) } });
            if (isMounted) {
                setCurrentData(response.results || []);
                return response;
            }
        } catch (error) {
            console.error("Error fetching exit data:", error);
        }
        return null; // Always return something
    };

    const fields = React.useMemo(() =>
        (CurrentData || []).map(
            ({ panel_member, responses, recommendation, rating, comments, interview_name }) => ({
                title: `Feedback - ${interview_name || ''}`,
                field: [
                    {
                        key: "panel_member",
                        formatter: () => (
                            <EmployeeDetailUI
                                id={panel_member}
                                InformationKeys={["name", "department", "position", "branch"]}
                                ViewVariant="vertical"
                                className="w-full"
                            />
                        ),
                    },
                    {
                        key: "comments",
                        label: "Comments / Observations",
                        formatter: () => comments || "—",
                    },
                    {
                        key: "rating",
                        label: "Rating",
                        formatter: () => rating ?? "N/A",
                    },
                    {
                        key: "recommendation",
                        label: "Recommendation",
                        formatter: () => recommendation ?? "N/A",
                    },
                    {
                        key: "responses",
                        label: "Feedback Responses",
                        formatter: () =>
                            responses && responses.length > 0 ? (
                                <ul className="list-disc pl-4 space-y-1">
                                    {responses.map(({ field_label, response_numeric, response_text }, idx) => (
                                        <li key={idx}>
                                            {field_label}:{" "}
                                            <strong> {response_numeric ?? response_text ?? "—"}</strong>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                "No responses"
                            ),
                    },
                ],
            })
        ),
        [CurrentData]
    );
    return (
        <>
            <NavigationSheetComponent
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                title={`Interview Feedback Details`}
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

export default ViewInterviewFeedback;
