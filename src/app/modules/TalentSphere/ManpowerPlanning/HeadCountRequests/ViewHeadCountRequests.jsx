import React, { useState } from "react";
import {
    NavigationSheetComponent,
    DetailContent,
    StatusList,
} from "components";
import { FormatID, BranchName } from "utils/getValuesFromTables";
import { StatusLabel, StatusButtons } from "components";
import { getHeadcountRequestData, saveUpdateHeadcountRequest } from "app/hooks/talentSphere";

const ViewHeadCountRequests = ({
    isOpen,
    setIsOpen,
    currentId,
    reloadData = () => { },
    DataList = [],
    ViewMode = false,
    isTeamView = false,
}) => {
    const [forceLoad, setForceLoad] = useState(false);
    const handleSubmit = async (id, { comment }) => {
        try {
            await saveUpdateHeadcountRequest({ rejection_reason: comment }, id);
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
            title: "Request Details",
            footerTitle: "Request At",
            footerField: "requested_on",
            field: [
                {
                    key: "id",
                    label: "Id",
                    formatter: (cell, row) => <FormatID value={cell} prefix={"HCR-"} />,
                },
                {
                    key: "branch",
                    label: "Branch",
                    formatter: (cell) => <BranchName value={cell} />,
                },
                {
                    key: "department_name",
                    label: "Department",
                },

                {
                    key: "attachment_url",
                    label: "Attachment",
                },
                {
                    key: "requested_by_name",
                    label: "Requested By",
                },
                {
                    key: "reason",
                    label: "Reason for Request",
                },
                {
                    key: "rejection_reason",
                    label: "Rehection Reason",
                    renderCondition: (_, data) => {
                        if (data?.status?.toLowerCase() === 'rejected') return true;
                        else return false;
                    },
                },
            ],
        },
        {
            title: "Headcount Details",
            field: [
                {
                    key: "allocated_headcount",
                    label: "Allocated",
                },
                {
                    key: "consumed_headcount",
                    label: "Consumed",
                },
                {
                    key: "remaining_headcount",
                    label: "Remaining",
                },
                {
                    key: "requested_headcount",
                    label: "Requested Additional",
                },
            ],
        },
        {
            title: "Approval Details",
            field: [
                {
                    key: "approval_details",
                    formatter: (cell) => (
                        <StatusList status_list={cell} className="my-3" />
                    ),
                },
            ],
        },
        {
            customContent: true,
            renderContent: (data) => {
                if (ViewMode || isTeamView) return null;
                return (
                    <StatusButtons
                        permissionKey={'MANAGE_HEADCOUNT_REQUESTS'}
                        status={data?.status}
                        current_approver={data.current_approver}
                        final_approver={data.final_approvers || []}
                        request_id={data.request}
                        RejectionConfig={{ label: 'Rejection Reason', required: true, }}
                        setResponse={async (response, _, approval_data) => {
                            if (response) {
                                await handleSubmit(data.id, approval_data);
                                setForceLoad(!forceLoad);
                            }
                        }}
                    />
                );
            },
        },
    ];

    const fetchData = async (id, isMounted) => {
        try {
            const response = await getHeadcountRequestData(id);
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
                title="Headcount Request Details"
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

export default ViewHeadCountRequests;
