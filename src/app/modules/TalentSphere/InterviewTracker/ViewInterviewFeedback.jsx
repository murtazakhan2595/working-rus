import { toast } from "react-toastify";
import React, { useState } from "react";
import { FormatID } from "utils/getValuesFromTables";
import { getFeedBackFormList, getInterviewById } from "app/hooks/talentSphere";
import {
    ClearanceSheet,
    UploadExitInterviewDetails,
} from "app/modules/ExitAndClearance";
import { Button } from "components/ui/button";
// import { CoverFileUpload } from "components/FormControl";
import {
    EmployeeOverview,
    SheetUI,
    StatusLabel,
    NavigationSheetComponent,
    DetailContent,
    StatusList,
    EmployeeDetailUI,
} from "components";
import { RejectedApplication, ResumeBankApplication } from "app/utils/Types/TalentSphere";
import { GetDispatchStateList } from "utils/Lists";
import { InterviewDetails } from "app/modules/TalentSphere/Sections";
import { AddInterviewFeedback } from "app/modules/TalentSphere";
import { TextAreaInput } from "components/FormControl";
import { SelectInputComponent } from "components/FormControl";
import { useSelector } from "react-redux";
import { HasAccess } from "utils/PermissionUtils";
import moment from "moment";

const ViewInterviewFeedback = ({
    currentId,
    DataList = [],
    reloadData = () => { },
    isOpen,
    setIsOpen = () => { },
}) => {
    const [CurrentData, setCurrentData] = useState([]);

    const fetchData = async (id, isMounted) => {
        try {
            const response = await getInterviewById(id);
            if (isMounted) {
                setCurrentData(response.interview_feedbacks || []);
                return response;
            }
        } catch (error) {
            console.error("Error fetching exit data:", error);
        }
        return null; // Always return something
    };

    const fields = React.useMemo(() =>
        (CurrentData || []).map(
            ({ panel_member_name, panel_member, responses, recommendation, rating, comments }) => ({
                title: `${panel_member_name} Feedback`,
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

    console.log(CurrentData, fields)
    return (
        <>
            <NavigationSheetComponent
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                title={`Interview Details`}
                currentItem_Id={currentId}
                dataList={DataList}
                reloadData={reloadData}
                allowEdit={false}
                allowDelete={false}
                fetchCurrentItemDetails={fetchData}
            // dataUniqueKey='applicant_id'
            >
                <DetailContent fields={fields} />
            </NavigationSheetComponent>
        </>
    );
};

export default ViewInterviewFeedback;
