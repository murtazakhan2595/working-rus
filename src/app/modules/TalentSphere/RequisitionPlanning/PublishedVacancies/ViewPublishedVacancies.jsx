import React, { useState } from "react";
import {
    NavigationSheetComponent,
    DetailContent,
    StatusList,
} from "components";
import { renderDate } from "utils/renderValues";
import { StatusLabel, SheetUI, MultiStatusLabel, StatusButtons, EmployeeDetailUI } from "components";
import { getVacancyData } from "app/hooks/talentSphere";
import { getActiveShiftData } from "app/hooks/shiftManagement";
import { handleRequest } from "app/hooks/general";
import AttachmentUI from "components/ui/AttachmentUI";
import { toast } from "react-toastify";
import { saveUpdateAttendanceAdjustment } from "app/hooks/attendance";
import { TextAreaInput } from "components/FormControl";
import { getAttendanceData } from "app/hooks/attendance";
import { saveAttendance } from "app/hooks/attendance";
import { RequisitionViewFields } from 'app/modules/TalentSphere/Sections';


const ViewPublishedVacancies = ({
    isOpen,
    setIsOpen,
    currentId,
    reloadData = () => { },
    DataList = [],
}) => {
    const [forceLoad, setForceLoad] = useState(false);
    // Define the fields to display
    const fields = [
        {
            customContent: true,
            renderContent: (data) => {
                return (
                    <div className="flex flex-wrap justify-end gap-2 items-center flex-wrap">
                        <StatusLabel className="ml-10" status={data.status}>
                            {data?.status?.toLowerCase()}
                        </StatusLabel>
                    </div>
                );
            },
        },
        {
            title: "Vacancy Details",
            footerTitle: "Created At",
            footerField: "created_at",
            field: [
                {
                    key: "publish_date",
                    label: "Publish Date",
                    formatter: (cell) => renderDate(cell, '--', 'date'),
                },
                {
                    key: "due_date",
                    label: "Due Date",
                    formatter: (cell) => renderDate(cell, '--', 'date'),
                },
                {
                    key: "requisition_type",
                    label: "Requisition Type",
                    formatter: (cell) => <div className="text-capitalize">{cell}</div>,
                },
                {
                    key: "posted_portals",
                    label: "Posted On",
                    formatter: (cell) => <MultiStatusLabel statusList={cell} variant="info" displayAll={true} />

                },
                {
                    key: "total_applications",
                    label: "Total Applications",
                },
            ],
        },
        ...RequisitionViewFields,

    ];

    const fetchData = async (id, isMounted) => {
        try {
            const response = await getVacancyData(id);
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
                title="Published Vacancy Details"
                currentItem_Id={currentId}
                ForceItemLoad={forceLoad}
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

export default ViewPublishedVacancies;
