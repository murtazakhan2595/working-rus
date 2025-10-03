import React, { useState, useEffect } from "react";
import {
    NavigationSheetComponent,
    DetailContent,
    StatusList,
} from "components";
import { FormatID, BranchName, DesignationName } from "utils/getValuesFromTables";
import { renderDate } from "utils/renderValues";
import { StatusLabel, StatusButtons } from "components";
import { getOfferLetterData, saveUpdateHeadcountRequest } from "app/hooks/talentSphere";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { EmployeeName } from "utils/getValuesFromTables";
import AttachmentUI from "components/ui/AttachmentUI";
import { Button } from "components/ui/button";
import AlertDialogue from "components/ui/AlertDialogue";

const ApplicantOffer = () => {
    const { id } = useParams();
    const [FormData, setFormData] = useState({});
    const [CurrentItem, setCurrentItem] = useState({});
    const [IsLoading, setIsLoading] = useState(false);
    const [OpenAlterMessage, setOpenAlterMessage] = useState(false);
    const handleSubmit = async () => {
        try {
            await saveUpdateHeadcountRequest();
        } catch (error) {
            // Handle errors and rollback form data
            console.error(error);
        }
    };
    const handleClick = (event, status, data) => {
        event.preventDefault();
        event.stopPropagation();
        if (status === 'accepted')
            setFormData({
                title: 'Confirm Accept?',
                description: `This action cannot be undone. Once accepted, your offer will be confirmed with a joining date of ${renderDate(data.joining_date)}. `,
                buttonType: 'success',
                status: status,
                className: 'text-emerald-600'
            })
        if (status === 'rejected')
            setFormData({
                title: 'Confirm Rejected?',
                description: `This action cannot be undone. Once rejected, your offer will no longer be valid and you will lose the vacancy`,
                buttonType: 'destructive',
                status: status,
                className: 'text-red-700'
            })
        setOpenAlterMessage(true)
    };

    // Define the fields to display
    const fields = [
        {
            title: "Applicant Information",

            field: [
                {
                    key: "applicant",
                    label: "Applicant Id",
                    formatter: (cell, row) => <FormatID value={cell} prefix={"APP-"} />,
                },
                {
                    key: "branch",
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

            ],
        },
        {
            title: "Job Information",

            field: [
                {
                    key: "branch",
                    label: "Job Position",
                },
                {
                    key: "department_name",
                    label: "Job Description",
                },
                {
                    key: "attachment_url",
                    label: "Department",
                },
                {
                    key: "attachment_url",
                    label: "Branch",
                },
                {
                    key: "attachment_url",
                    label: "Designation",
                },
                {
                    key: "reporting_manager",
                    label: "Reporting Manager",
                },
                {
                    key: "attachment_url",
                    label: "Work Location",
                },
                {
                    key: "attachment_url",
                    label: "Job Type",
                },
                {
                    key: "attachment_url",
                    label: "Work Mode",
                },
            ],
        },
        {
            title: "Offer Details",
            field: [
                {
                    key: "offered_salary",
                    label: "Offered Salary",
                },
                {
                    key: "expected_joining_date",
                    label: "Joining Date",
                    formatter: (cell) => renderDate(cell),
                },
                {
                    key: "expected_joining_date",
                    label: "Offer Validity",
                    formatter: (cell) => renderDate(cell),
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
        {
            customContent: true,
            renderContent: (data) => {
                return (
                    <div className="flex flex-wrap justify-end gap-2 my-5">
                        <Button
                            variant="success"
                            onClick={(event) => handleClick(event, "accepted", data)}
                        >
                            Approve
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={(event) => handleClick(event, "rejected", data)}
                        >
                            Reject
                        </Button>
                    </div>
                );
            },
        },
    ];
    useEffect(() => {
        const fetchData = async (isMounted, id) => {
            try {
                setIsLoading(true);
                const response = await getOfferLetterData(id);
                if (isMounted) {
                    setCurrentItem({ ...response });
                }
            } catch (error) {
                console.error("Error fetching roles:", error);
            } finally {
                setIsLoading(false);
            }
        };
        let isMounted = true;
        if (id) fetchData(isMounted, id);
        return () => {
            isMounted = false;
        };
    }, [id]);

    return (
        <div className="max-w-[678px] w-full m-auto">
            <div className={`font-bold ${CurrentItem?.status?.toLowerCase() === 'accepted' ? "text-emerald-600" :
                CurrentItem?.status?.toLowerCase() === 'rejected' ? "text-red-700" : "text-neutral-1200"} text-2xl ml-4 mt-8 capitalize`}>Job Offered - {CurrentItem.status}</div>
            <DetailContent fields={fields} currentItem={CurrentItem} />
            {
                OpenAlterMessage && (
                    <AlertDialogue
                        title={FormData.title}
                        description={FormData.description}
                        isOpen={OpenAlterMessage}
                        setIsOpen={(isOpen) =>
                            setOpenAlterMessage(false)
                        }
                        buttonType={FormData.buttonType}
                        handleContinue={handleSubmit}
                        className={FormData.className}
                    />
                )
            }
        </div >
    );
};

export default ApplicantOffer;
