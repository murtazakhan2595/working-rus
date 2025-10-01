import React, { useState } from "react";
import {
    NavigationSheetComponent,
    DetailContent,
    StatusList,
} from "components";
import { FormatID, BranchName, DepartmentName } from "utils/getValuesFromTables";
import { StatusLabel, SheetUI, MultiStatusLabel, StatusButtons, EmployeeDetailUI } from "components";
import { getRequisitionRequestData, getManpowerPlanningList, saveUpdateRequisitionRequest } from "app/hooks/talentSphere";
import { getActiveShiftData } from "app/hooks/shiftManagement";
import { handleRequest } from "app/hooks/general";
import AttachmentUI from "components/ui/AttachmentUI";
import { toast } from "react-toastify";
import { saveUpdateAttendanceAdjustment } from "app/hooks/attendance";
import { TextAreaInput, NumberInput } from "components/FormControl";
import { getAttendanceData } from "app/hooks/attendance";
import { saveAttendance } from "app/hooks/attendance";
import { RequisitionViewFields } from 'app/modules/TalentSphere/Sections';
import { errorClassName } from "components/FormControl";

const FormSheetData = {
    triggerText: "Submit",
    title: "Reject Attendance Update Request",
    description: null,
    footer: null,
    className: "max-w-[478px] w-full h-[400px]",
};
const ViewRequisitionRequest = ({
    isOpen,
    setIsOpen,
    currentId,
    reloadData = () => { },
    DataList = [],
    isTeamView = false,
}) => {
    const [forceLoad, setForceLoad] = useState(false);
    const [approvalBlockMessage, setApprovalBlock] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [ModalData, setModalData] = useState({});
    const handleApprovalClick = async (handleApprove = () => { }, { department, branch, number_of_positions, salary_max, salary_min, id }) => {
        setModalData({ handleApprove, department, branch, number_of_positions, salary_max, salary_min, title: 'Add Salary Range', id })
        setOpenModal(true);
    };
    const handleRejectClick = async (comment, id) => {
        await saveUpdateRequisitionRequest({ rejectio_reason: comment }, id);
    };

    const handleSubmit = async ({ handleApprove = () => { }, department, branch, number_of_positions, salary_max, salary_min, id }) => {
        try {
            const blockMessage = 'Approval blocked — Please update the manpower budget before approving this requisition.'
            const filterData = { department, branch, fiscal_year: (new Date()).getFullYear() }
            const response = await getManpowerPlanningList({ filterData });
            if (response) {
                const ResponseList = response.results;
                if (!Array.isArray(ResponseList) || ResponseList.length === 0) {
                    setApprovalBlock(blockMessage);
                    return null;
                }
                else {
                    const headcount_details = ResponseList[0];
                    const allowed_headcount = parseInt(headcount_details['planned_headcount']) - parseInt(headcount_details['existing_headcount']);
                    const remaining_budget = parseFloat(headcount_details['total_allocated_budget']) - parseFloat(headcount_details['consumed_budget']);
                    if (parseInt(number_of_positions) > allowed_headcount) {
                        setApprovalBlock(`${blockMessage} Vacancy count increases the planned headcount.`);
                        return null;
                    }
                    else if (parseFloat(salary_max) > remaining_budget) {
                        setApprovalBlock(`${blockMessage} Budget exceeds the allocated budget.`);
                        return null;
                    } else {
                        await saveUpdateRequisitionRequest({ salary_max, salary_min }, id);
                        setApprovalBlock(null);
                        handleApprove('Approved');

                    }
                }
            }
        } catch (error) {
            // Handle errors and rollback form data
            console.error(error);
        } finally {
            setOpenModal(false);
            setModalData({});
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
            title: "Requestor Details",
            field: [
                {
                    key: "requested_by",
                    label: "",
                    formatter: (cell) => (<EmployeeDetailUI id={cell} InformationKeys={["name", "department", "position", "branch",]} ViewVariant={"vertical"} />),
                },
            ],
        },
        ...RequisitionViewFields,
        {
            title: "Approval Details",
            field: [
                {
                    key: "approval_details",
                    formatter: (cell, data) => {
                        if (!data.approval_required) return 'Approval was not required';
                        return (<StatusList status_list={cell} className="my-3" />)
                    },
                },
            ],
        },
        {
            customContent: true,
            renderContent: () => {
                if (approvalBlockMessage)
                    return (<div className={`${errorClassName} my-2`}>{approvalBlockMessage}</div>);
            },
        },
        {
            customContent: true,
            renderContent: (data) => {
                if (isTeamView) return null;
                return (
                    <StatusButtons
                        permissionKey={'MANAGE_REQUISITION_REQUEST'}
                        status={data?.status}
                        current_approver={data.current_approver}
                        final_approver={data.final_approvers || []}
                        request_id={data.request}
                        RejectionConfig={{ label: 'Rejection Reason', required: true }}
                        onApprove={(handleApprove) => handleApprovalClick(handleApprove, data)}
                        setResponse={async (response, status, approval_Data) => {
                            if (response) {
                                if (status?.toLowerCase() === 'rejected')
                                    await handleRejectClick(approval_Data.comment, data.id);
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
            const response = await getRequisitionRequestData(id);
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
                title="Requisition Details"
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
            {openModal && (
                <SheetUI
                    isOpen={openModal}
                    setIsOpen={setOpenModal}
                    variant="modal"
                    sheetConfig={ModalData}
                    formConfig={{
                        initialValues: ModalData,
                        enableReinitialize: true,
                        handleSubmit: handleSubmit,
                        validateFormSchema: () => {
                            const error = {};
                            return error;
                        },
                        submitButtonText: "Confirm",
                        cancelButtonText: "Cancel",
                        columns: 1,
                        formFields: [
                            {
                                sheetCardExtension: false,
                                sheetCardTitle: "Salary Details",
                                InputFields: [
                                    {
                                        InputField: NumberInput,
                                        name: "salary_min",
                                        required: true,
                                        label: "Minimum Salary",
                                    },
                                    {
                                        InputField: NumberInput,
                                        name: "salary_max",
                                        required: true,
                                        label: "Maximum Salary",
                                    },
                                ].filter(Boolean),
                            },
                        ],
                    }}
                ></SheetUI>
            )}
        </>
    );
};

export default ViewRequisitionRequest;
