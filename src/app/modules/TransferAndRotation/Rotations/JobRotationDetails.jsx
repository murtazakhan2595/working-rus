import React, { useState } from "react";
import {
    NavigationSheetComponent,
    DetailContent,
    StatusList,
} from "components";
import { getJobRotationRequests, getJobRotationById } from 'app/hooks/transferAndRotation';
// import AddGraceTimeForm from "./AddGraceTimeForm";
import { FormatID } from "utils/getValuesFromTables";
import { StatusLabel, StatusButtons, EmployeeDetailUI } from "components";
import { EmployeeOverview } from "components";
import { renderDate } from "utils/renderValues";
import { DepartmentName, ManagerName, BranchName, DesignationName, EmployeeName } from "utils/getValuesFromTables";

const JobRotationDetails = ({
    isOpen,
    setIsOpen,
    currentId,
    reloadData = () => { },
    DataList = [],
    ViewOnly = false,
}) => {

    const [forceLoad, setForceLoad] = useState(false);

    // Define the fields to display
    const fields = [
        {
            customContent: true,
            renderContent: (data) => {
                return (
                    <div className="flex flex-wrap justify-between gap-2 items-center flex-wrap">
                        <EmployeeOverview
                            id={data.employee}
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
            title: "Employee Details",
            field: [
                {
                    key: "employee",
                    label: "",
                    formatter: (cell) => (
                        <EmployeeDetailUI
                            id={cell}
                            InformationKeys={["name", "department", "position", "branch", "manager"]}
                            ViewVariant={"vertical"}
                            className
                        />
                    ),
                },
            ],
        },
        {
            title: "Job Rotation Details",
            footerTitle: "Request At",
            footerField: "created_at",
            field: [
                {
                    key: "id",
                    label: "Id",
                    formatter: (cell, row) => <FormatID value={cell} prefix={"JR-"} />,
                },
                {
                    key: "new_department",
                    label: "Requested Department",
                    formatter: (cell) => (<DepartmentName value={cell} fallBackText={'--'} />),
                },
                {
                    key: "new_designation",
                    label: "Requested Designation",
                    formatter: (cell) => (<DesignationName value={cell} fallBackText={'--'} />),
                },
                {
                    key: "new_branch",
                    label: "Requested Branch",
                    formatter: (cell) => (<BranchName value={cell} fallBackText={'--'} />),
                },
                {
                    key: "new_reporting_manager",
                    label: "Requested Manager",
                    formatter: (cell) => (<ManagerName value={cell} fallBackText={'--'} />),
                },
                {
                    key: "rotation_cap_time",
                    label: "Cap Time",
                    formatter: (cell) => `${cell} Day('s)`,
                },
                {
                    key: "effective_date",
                    label: "Effective Date",
                    formatter: (cell) => renderDate(cell, '--'),
                },
                {
                    key: "rotation_type",
                    label: "Rotation Type",
                    formatter: (cell) => <span className="text-capitalize">{cell}</span>,
                },
                {
                    key: "rotation_expiry_date",
                    label: "Expiry Date",
                    formatter: (cell) => renderDate(cell, '--'),
                },
                {
                    key: "custom_reason",
                    label: "Reason",
                },
                {
                    key: "notes",
                    label: "Notes",
                },
            ],
        },
        {
            title: "Rotation Summary",
            field: [
                {
                    key: "rotation_summary",
                    formatter: (cell) => {
                        console.log(cell);
                        return (
                            <ol className="[list-style:decimal-leading-zero] ml-5">
                                {(cell || []).map((rotation) => {
                                    const approver = (rotation?.approval_logs[0] || {})?.changed_by;
                                    return (
                                        <li className={'marker:text-plum-900 marker:font-semibold  mb-3'}>
                                            <div><span className="text-plum-900 font-semibold">Rotation{' '}</span>(<span className="text-capitalize">{rotation.status}</span>{approver && <span>{' '}by <EmployeeName value={approver} /></span>})</div>
                                            <ul className="[list-style:disc] ml-4">
                                                {rotation.new_branch && <li><BranchName value={rotation.old_branch} /> (Branch) {'->'} <BranchName value={rotation.new_branch} /> (Branch)</li>}
                                                {rotation.new_department && <li><DepartmentName value={rotation.old_department} /> (Department) {'->'} <DepartmentName value={rotation.new_department} /> (Department)</li>}
                                                {rotation.new_designation && <li><DesignationName value={rotation.old_designation} /> (Designation) {'->'} <DesignationName value={rotation.new_designation} /> (Designation)</li>}
                                                {rotation.new_reporting_manager && <li><ManagerName value={rotation.old_reporting_manager} /> (Manager) {'->'} <ManagerName value={rotation.new_reporting_manager} /> (Manager)</li>}
                                            </ul>
                                            <div>Effective from {renderDate(rotation.effective_date)} {rotation.rotation_type === 'temporary' && ` to ${renderDate(rotation.rotation_expiry_date)}`}</div>
                                        </li>
                                    );
                                })}
                            </ol>
                        )
                    },
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
                if (ViewOnly) return null;
                return (
                    <StatusButtons
                        permissionKey={'MANAGE_JOB_ROTATION'}
                        status={data?.status}
                        current_approver={data.current_approver}
                        final_approver={data.final_approvers || []}
                        request_id={data.hierarchy_request}
                        RejectionConfig={{ label: 'Rejection Comments', required: true }}
                        ApprovalConfig={{ label: 'Add Comments', required: false }}
                        setResponse={(response) => {
                            if (response) {
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
            const response = await getJobRotationById(id);
            if (isMounted) {
                const employee = response.employee;
                const rotation_summary = await getJobRotationRequests({ filterData: { employee: employee } })
                return { ...response, rotation_summary: rotation_summary.results };
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
                title="Job Rotation Details"
                currentItem_Id={currentId}
                ForceItemLoad={forceLoad}
                dataList={DataList}
                reloadData={reloadData}
                allowEdit={false}
                allowDelete={false}
                fetchCurrentItemDetails={fetchData}
                deleteItemName="name"
                editTooltip="Edit Grace Time"
                deleteTooltip="Delete Geace Time"
            >
                <DetailContent title="Adjustment Details" fields={fields} />
            </NavigationSheetComponent>
        </>
    );
};

export default JobRotationDetails;
