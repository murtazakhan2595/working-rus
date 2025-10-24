import React, { useState } from "react";
import {
    NavigationSheetComponent,
    DetailContent,
} from "components";
import { FormatID } from "utils/getValuesFromTables";
import { StatusLabel } from "components";
import { getOfferTrackingData, UpdateOfferTrackingStatus, saveUpdateApplication } from "app/hooks/talentSphere";
import { EmployeeName } from "utils/getValuesFromTables";
import AttachmentUI from "components/ui/AttachmentUI";
import { Button } from "components/ui/button";
import { renderDate } from "utils/renderValues";
import moment from "moment";
import { HasAccess } from "utils/PermissionUtils";
import { Currency } from "utils/getValuesFromTables";

const ViewFinalOffer = ({
    isOpen,
    setIsOpen,
    currentId,
    reloadData = () => { },
    DataList = [],
}) => {
    const UpdatePermitted = HasAccess("UPDATE_OFFER_SEND_TO_APPLICANT");
    const [forceLoad, setForceLoad] = useState(false);
    const handleSubmit = async (event, status, data) => {
        event.preventDefault();
        event.stopPropagation();
        try {
            const response = await UpdateOfferTrackingStatus({ ...data, status: status }, data.id);
            if (response) {
                if (status === 'hired')
                    await saveUpdateApplication({ status: status }, data.applicant);

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
                    key: "applicant_email",
                    label: "Email",
                },

                {
                    key: "applicant_contact_number",
                    label: "Contact Number",
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
                    formatter: (cell, data) => <div>{cell} <Currency value={data.requisitation_currency} /></div>
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
                },
                {
                    key: "work_location",
                    label: "Work Location",
                },
            ],
        },
        {
            title: `Offer Letter`,
            field: [
                {
                    key: 'final_letter_pdf',
                    formatter: (cell) =>
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
        {
            title: "Audit Logs",
            field: [
                {
                    key: "audit_logs",
                    formatter: (cell) => (cell || []).map((log, index) => (
                        <div key={index} className="mb-1">
                            <div className="text-sm text-neutral-1100 capitalize">
                                {/* →*/} {log?.new_status}{" "}
                                {log?.changed_by && <span className="text-gray-1100">
                                    by <EmployeeName value={log?.changed_by} fallBackText={log?.changed_by} />
                                </span>}
                            </div>
                            <div className="text-xs text-gray-900">
                                {renderDate(log?.changed_on, '--', 'date-time')}
                            </div>
                        </div>
                    )),
                },
            ],
        },
        {
            customContent: true,
            renderContent: (data) => {
                if (!data || !data.status || !UpdatePermitted) return null;
                const joining_date_passed = moment(data.joining_date).startOf('day').isSameOrBefore(moment().startOf('day'))
                const validity_date_passed = moment(data.validity_date).startOf('day').isSameOrBefore(moment().startOf('day'))
                const status = data?.status?.toLowerCase();
                return (
                    <div className="flex flex-wrap justify-end gap-2 my-5">
                        {validity_date_passed && status === 'pending' &&
                            <Button
                                variant="continue"
                                onClick={(event) => handleSubmit(event, "withdrawn", data)}
                            >
                                Withdraw
                            </Button>
                        }
                        {joining_date_passed && status === 'accepted' &&
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
