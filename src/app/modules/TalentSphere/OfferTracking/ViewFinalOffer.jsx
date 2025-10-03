import React, { useState } from "react";
import {
    NavigationSheetComponent,
    DetailContent,
} from "components";
import { FormatID, BranchName, DesignationName } from "utils/getValuesFromTables";
import { StatusLabel, StatusButtons } from "components";
import { getOfferTrackingData, UpdateOfferTrackingStatus } from "app/hooks/talentSphere";
import { EmployeeName } from "utils/getValuesFromTables";
import AttachmentUI from "components/ui/AttachmentUI";
import { Button } from "components/ui/button";
import { renderDate } from "utils/renderValues";
import moment from "moment";
import { HasAccess } from "utils/PermissionUtils";

const ViewFinalOffer = ({
    isOpen,
    setIsOpen,
    currentId,
    reloadData = () => { },
    DataList = [],
}) => {
    const UpdatePermitted = HasAccess("MANAGE_ATTENDANCE_ADJ_REQUESTS");
    const [forceLoad, setForceLoad] = useState(false);
    const handleSubmit = async (event, status, data) => {
        event.preventDefault();
        event.stopPropagation();
        try {
            const response = await UpdateOfferTrackingStatus({ ...data, status: status }, data.id);
            if (response) {
                setForceLoad(!forceLoad)
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
                    <div className="flex flex-wrap justify-end gap-2 items-center flex-wrap">
                        <StatusLabel className="ml-10" status={data.status}>
                            {data?.status?.toLowerCase()}
                        </StatusLabel>
                    </div>
                );
            },
        },
        {
            title: "Applicant Details",

            field: [
                {
                    key: "applicant",
                    label: "Applicant Id",
                    formatter: (cell, row) => <FormatID value={cell} prefix={"APP-"} />,
                },
                {
                    key: "applicant_name",
                    label: "Applicant Name",
                },
                {
                    key: "department_name",
                    label: "Email",
                },

                {
                    key: "attachment_url",
                    label: "Contact Number",
                },
                {
                    key: "requested_by_name",
                    label: "Job Title",
                },
            ],
        },
        {
            title: "Offer Details",
            footerTitle: "Offer Sent On",
            footerField: "sent_on",
            field: [
                {
                    key: "sent_by",
                    label: "Sent By",
                    formatter: (cell) => <EmployeeName value={cell} />
                },
                {
                    key: "offered_salary",
                    label: "Offered Salary",
                },
                {
                    key: "joining_date",
                    label: "Joining Date",
                    formatter: (cell) => renderDate(cell),
                },
                {
                    key: "validity_date",
                    label: "Validity Date",
                    formatter: (cell) => renderDate(cell),
                },
                {
                    key: "designation",
                    label: "Designation",
                    // formatter: (cell) => <EmployeeName value={cell} />
                },
                {
                    key: "reporting_manager",
                    label: "Reporting Manager",
                    formatter: (cell) => <EmployeeName value={cell} />
                },
                {
                    key: "work_location",
                    label: "Work Location",
                },
                {
                    key: "remarks",
                    label: "Remarks",
                },
            ],
        },
        {
            title: `Offer Letter`,
            field: [
                {
                    key: 'final_letter_pdf',
                    formatter: (cell, data) =>
                        cell ? (
                            <AttachmentUI
                                attachment={cell}
                                name={`Final Offer Letter`}
                                viewOnly={true}
                            />
                        ) : (
                            <div className="text-neutral-1000 text-sm">No document attached</div>
                        ),
                },
            ],
        },
        // {
        //     title: "Approval Details",
        //     field: [
        //         {
        //             key: "approval_details",
        //             formatter: (cell) => (
        //                 <StatusList status_list={cell} className="my-3" />
        //             ),
        //         },
        //     ],
        // },
        {
            customContent: true,
            renderContent: (data) => {
                if (!data || !data.status) return null;
                const joining_date_passed = moment(data.joining_date).startOf('day').isSameOrBefore(moment().startOf('day'))
                const validity_date_passed = moment(data.validity_date).startOf('day').isSameOrBefore(moment().startOf('day'))
                if (data?.status?.toLowerCase() === 'pending' && UpdatePermitted)
                    return (
                        <div className="flex flex-wrap justify-end gap-2 my-5">
                            {validity_date_passed &&
                                <Button
                                    variant="continue"
                                    onClick={(event) => handleSubmit(event, "withdrawn", data)}
                                >
                                    Withdraw
                                </Button>
                            }
                            {joining_date_passed &&
                                <>
                                    <Button
                                        variant="default"
                                        onClick={(event) => handleSubmit(event, "hired", data)}
                                    >
                                        Hired
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        onClick={(event) => handleSubmit(event, "not_joined", data)}
                                    >
                                        Not Joined
                                    </Button>
                                </>
                            }
                        </div>
                    );
            },
        },
    ];

    const fetchData = async (id, isMounted) => {
        try {
            const response = await getOfferTrackingData(id);
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
                title="Offer Details"
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

export default ViewFinalOffer;
