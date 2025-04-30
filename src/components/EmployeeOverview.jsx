import React from "react";
import { DepartmentName, DesignationName } from "utils/getValuesFromTables";
import { GetUser } from "utils/getValuesFromTables";
import { OverviewCard } from "components";
import { BranchName } from "utils/getValuesFromTables";

// const combineFLName = employee?.first_name?.charAt(0).toUpperCase() +  employee?.last_name?.charAt(0).toUpperCase()
const EmployeeOverview = React.memo(
  ({
    id,
    className = null,
    showId = false,
    showPosition = false,
    showDepartment = false,
    showEmail = false,
    avatarSize='10',
    showBranchName = false,
    showNationality = false,
    fallbackData = null,
  }) => {
    const userProfile = id ? GetUser(id) : null;
    
    // If user profile not found but fallback data provided, use that
    const displayData = userProfile || fallbackData || {};
    
    // If no data at all, don't render anything
    if (!userProfile && !fallbackData) return null;
    
    return (
      <OverviewCard
        className={className}
        avatarProps={{
          src: displayData?.profile_picture,
          fallbackText: displayData?.name_initials || displayData?.name?.split(' ').map(n => n[0]).join('').toUpperCase(),
          text: displayData?.name,
          size: avatarSize,
        }}
        title={displayData?.name}
        subtitle={showId ? displayData?.serial_number : null}
        additionalInfo={[
          ...(showEmail ? [displayData.work_email] : []), // Ensure it's an array
          ...(showPosition
            ? [displayData?.position || <DesignationName value={displayData?.department_position} />]
            : []), // Ensure it's an array
          ...(showDepartment
            ? [<DepartmentName value={displayData?.department_name} />]
            : []), // Ensure it's an array
          ...(showBranchName
            ? [<BranchName value={displayData?.branch_id} fallbackText="" />]
            : []), // Ensure it's an array
          ...(showNationality
            ? [displayData?.nationality]
            : []), // Ensure it's an array
        ]}
      />
    );
  }
);

export default EmployeeOverview;
