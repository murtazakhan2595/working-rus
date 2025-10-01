import { toast } from "react-toastify";
import React, { useState } from "react";
import { FormatID } from "utils/getValuesFromTables";
import { getInterviewFeedbackData, saveUpdateApplication, saveUpdateResumeBankApplication, saveUpdateRejectedApplication } from "app/hooks/talentSphere";
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
    const [CurrentData, setCurrentData] = useState(false);

    const fetchData = async (id, isMounted) => {
        try {
            const response = await getInterviewFeedbackData(id);
            if (isMounted) {
                setCurrentData(response);
                return response;
            }
        } catch (error) {
            console.error("Error fetching exit data:", error);
        }
        return null; // Always return something
    };

    const fields = React.useMemo(() => [
        {
            title: "Panel Member Details",
            field: [
                {
                    key: "panel_member",
                    label: "",
                    formatter: (cell) => (
                        <EmployeeDetailUI
                            id={cell}
                            InformationKeys={["name", "department", "position", "branch",]}
                            ViewVariant={"vertical"}
                            className
                        />
                    ),
                },
            ],
        },
        {
            title: "General Feedback",
            field: [
                {
                    key: "comments",
                    label: "Comments / Observations",
                },
                {
                    key: "rating",
                    label: "Rating",
                },
                {
                    key: "recommendation",
                    label: "Recommendation",
                },
            ],
        },
        {
            title: "Feedback Form Responses",
            field: CurrentData?.responses
                ? (CurrentData.responses || []).map(({ field_label, response_numeric, response_text }) => ({
                    key: `${response_numeric || response_text}`,
                    label: `${field_label}`,
                    formatter: () => response_numeric || response_text,
                }))
                : [],
        },

    ], []);

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
