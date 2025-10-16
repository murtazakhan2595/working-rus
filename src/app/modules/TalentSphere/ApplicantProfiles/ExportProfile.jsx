import React, { useState } from "react";
import { usePermissions } from "utils/PermissionUtils";
import { getApplicantsList, getApplicantsData } from "app/hooks/talentSphere";
import { Button } from "components/ui/button";
import { exportRecordToExcel } from "utils/downloadUtils";
import { renderRange, renderDate } from "utils/renderValues";
import { ExportApplicantsRecord } from "app/modules/TalentSphere/Sections";
import { GetDispatchStateList } from "utils/Lists";

export default function ExportProfile({ filterData, variant = 'all-profiles', applicant_id }) {
    const { hasAccess } = usePermissions();
    const Currencies = GetDispatchStateList("currencies", "common");
    const exportPermitted = hasAccess("EXPORT_APPLICANT_DETAILS");
    const [isExporting, setIsExporting] = useState(null);

    if (!exportPermitted) return null;

    const exportAttendanceToExcel = async (event) => {
        setIsExporting(true);
        try {
            event.preventDefault();
            const response = variant === "all-profiles" ?
                await getApplicantsList({
                    filterData: { ...filterData },
                    ordering: "-id",
                }) :
                await getApplicantsData(applicant_id);

            if (response) {
                const ResponseData = response.results ?? [response];
                if (
                    !ResponseData ||
                    !Array.isArray(ResponseData) ||
                    ResponseData.length === 0
                ) {
                    // setOpenActionMessage(true);
                } else {
                    const dataToExport = await Promise.all(
                        ResponseData?.map(async (row) => {
                            return ExportApplicantsRecord(row, Currencies)
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
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <>
            <Button disabled={isExporting} onClick={exportAttendanceToExcel}>{isExporting ? 'Exporting' : 'Export To Excel'}</Button>
        </>

    );
}
