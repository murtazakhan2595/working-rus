import React, { useState, useEffect } from "react";
import {
    NavigationSheetComponent,
    DetailContent,
    StatusList,
} from "components";
import { FormatID, BranchName, DesignationName } from "utils/getValuesFromTables";
import { renderDate } from "utils/renderValues";
import { PageLoader, StatusButtons } from "components";
import { getApplicantOfferDetails, saveApplicantOfferResponse } from "app/hooks/talentSphere";
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
            const response = await saveApplicantOfferResponse(id, FormData.status === 'accepted');
            if (response) {
                fetchData(true, id);
                setOpenAlterMessage(false);
                setFormData({});
            }
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
            title: "",
            renderSectionCondition: (row) => row.status !== 'pending',
            field: [{
                key: 'status',
                formatter: (cell) => {
                    const status = cell?.toLowerCase();
                    if (!status) return null;
                    return status === 'accepted' ? (
                        <div className="flex flex-wrap justify-end gap-2 items-center">
                            We are delighted to know that you have accepted our offer and officially welcome you to our organization. 🎉
                            As the first step of your onboarding process, our team will be sharing your login credentials along with initial setup guidelines. Please keep an eye on your inbox for further instructions.
                            We look forward to having you on board and wish you a successful journey with us.
                            <br /> Best regards,
                            <br /> HR Team
                        </div>
                    ) : (
                        <div className="flex flex-wrap justify-end gap-2 items-center">
                            Thank you for informing us of your decision regarding our offer. While we are of course a bit disappointed that you will not be joining Tecbrix, we respect your choice and wish you success in your future endeavors.
                            We truly appreciate the time and effort you invested during our selection process, and we would be happy to reconnect for any suitable opportunities in the future.
                        </div>
                    );
                },
            }]
        },
        {
            title: "Applicant Information",

            field: [
                {
                    key: "applicant_id",
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
            title: "Job Information",
            field: [
                {
                    key: "job_title",
                    label: "Job Position",
                },
                {
                    key: "job_description",
                    label: "Job Description",
                },
                {
                    key: "department",
                    label: "Department",
                },
                {
                    key: "branch",
                    label: "Branch",
                },
                {
                    key: "work_location",
                    label: "Work Location",
                },
                {
                    key: "job_type",
                    label: "Job Type",
                },
                {
                    key: "work_mode",
                    label: "Work Mode",
                },
            ],
        },
        {
            title: "Offer Details",
            field: [
                {
                    key: "offer_salary",
                    label: "Offered Salary",
                },
                {
                    key: "joining_date",
                    label: "Joining Date",
                    formatter: (cell) => renderDate(cell),
                },
                {
                    key: "validity_date",
                    label: "Offer Validity",
                    formatter: (cell) => renderDate(cell),
                },

            ],
        },
        {
            title: `Offer Letter`,
            field: [
                {
                    key: 'offer_letter_pdf',
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
                if (data?.status?.toLowerCase() !== 'pending') return null;
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
    const fetchData = async (isMounted, id) => {
        try {
            setIsLoading(true);
            const response = await getApplicantOfferDetails(id);
            if (isMounted) {
                setCurrentItem({ ...response });
            }
        } catch (error) {
            console.error("Error fetching roles:", error);
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {

        let isMounted = true;
        if (id) fetchData(isMounted, id);
        return () => {
            isMounted = false;
        };
    }, [id]);

    return IsLoading ? <PageLoader /> : (
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
                        setIsOpen={() =>
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
