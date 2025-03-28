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
  }) => {
    const userProfile = id ? GetUser(id) : {};
    console.log("userProfile", userProfile);
    if (!userProfile) return null;
    return (
      <OverviewCard
        className={className}
        avatarProps={{
          src: userProfile?.profile_picture,
          fallbackText: userProfile?.name_initials,
          text: userProfile?.name,
          size: avatarSize,
        }}
        title={userProfile?.name}
        subtitle={showId ? userProfile?.serial_number : null}
        additionalInfo={[
          ...(showEmail ? [userProfile.work_email] : []), // Ensure it's an array
          ...(showPosition
            ? [<DesignationName value={userProfile?.department_position} />]
            : []), // Ensure it's an array
          ...(showDepartment
            ? [<DepartmentName value={userProfile?.department_name} />]
            : []), // Ensure it's an array
          ...(showBranchName
            ? [<BranchName value={userProfile?.branch_id} fallbackText="" />]
            : []), // Ensure it's an array
        ]}
      />
    );
  }
);

export default EmployeeOverview;
