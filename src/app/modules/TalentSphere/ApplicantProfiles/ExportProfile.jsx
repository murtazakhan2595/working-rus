import React from "react";
import { usePermissions } from "utils/PermissionUtils";
import { getApplicantsList } from "app/hooks/talentSphere";
import { Button } from "components/ui/button";
import { exportRecordToExcel } from "utils/downloadUtils";

export default function ExportProfile({ filterData }) {
    const { hasAccess } = usePermissions();
    const viewPermitted = hasAccess("TS_VIEW_APPLICANT_PROFILE");

    if (!viewPermitted) return null;

    const exportAttendanceToExcel = async (event) => {
        event.preventDefault();
        try {
            const response = await getApplicantsList({
                filterData: { ...filterData },
                ordering: "-id",
            });
            if (response) {
                const ResponseData = response.results;
                if (
                    !ResponseData ||
                    !Array.isArray(ResponseData) ||
                    ResponseData.length === 0
                ) {
                    // setOpenActionMessage(true);
                } else {
                    const dataToExport = await Promise.all(
                        ResponseData?.map(async (row) => {
                            return {
                                ID: row.serial_id,
                                'Candidate Name': row.candidate_id,
                                'Candidate Name': row.candidate_name,
                                Status: row.status,
                                Email: row.email,
                                'Contact Number': row.contact_number,
                                'Application Source': row.application_source,
                                'Emiratization Flag': row.emiratization_flag,
                                'Job Position': row.job_title,
                                Department: row.vacancy_department,
                                'Application Date': row.application_date,
                                Location: row.location,
                                'Screened By': row.screened_by,
                                'Screened Date': row.screened_date,
                                'AI Match Score': row.ai_match_score,
                                'AI Match Skills': row.ai_matched_skills,
                                'AI Missing Skills':row. ai_missing_skills,
                                'AI Suggested': row.ai_suggested ? 'Yes' : 'No',
                            };
                        })
                    );
                    exportRecordToExcel(
                        dataToExport,
                        "TALENT_SPHERE",
                        `Applicant_Profile.pdf`,);
                }
                // setAttendanceData(attendanceData.results);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <Button onClick={exportAttendanceToExcel}>Export To Excel</Button>
        </>

    );
}
