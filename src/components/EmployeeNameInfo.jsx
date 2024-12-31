import { DepartmentName, DesignationName } from "utils/getValuesFromTables";
import { getRandomColor } from "utils/renderValues";
import Avatar from "./ui/Avatar";
import { Badge } from "./ui/badge";
import { GetUser } from "utils/getValuesFromTables";

// const combineFLName = employee?.first_name?.charAt(0).toUpperCase() +  employee?.last_name?.charAt(0).toUpperCase()
const EmployeeNameInfo = ({
  name,
  department,
  position,
  id,
  leaveTypes,
  allotedLeave,
  className,
  date,
  row,
  showId = false,
  showPosition = false,
  showBadge = false,
  showDepartment = false,
}) => {
  const userProfile = GetUser(id);
  return (
    <div className={`flex items-start ${className??''}`}>
      <Avatar
        className="h-10 w-10"
        src={userProfile?.profile_picture}
        fallbackText={`${userProfile?.first_name?.charAt(
          0
        )}${userProfile?.last_name?.charAt(0)}`}
        text={`${userProfile?.name}`}
        alt={userProfile?.first_name?.charAt(0).toUpperCase()}
      />

      <div className="flex flex-col flex-wrap ml-2 whitespace-break-spaces">
        {id && showId && (
          <div className="sm:inline">
            ID: {userProfile.serial_number}
          </div>
        )}
        <div className="">{`${
          name ?? userProfile?.name ?? "N/A"
        }`}</div>
        {date && <p className="sm:inline text-sm">{date}</p>}
        <div className="hidden text-sm text-neutral-1200 md:inline">
          <div className="flex flex-col items-start gap-1">
            {showPosition && (
              <DesignationName
                value={position || userProfile?.department_position}
                className="text-neutral-1200"
              />
            )}
            {showDepartment && (
              <span>
                <DepartmentName
                  value={department || userProfile?.department_name}
                  className="text-neutral-1000"
                />
              </span>
            )}
          </div>
          {allotedLeave && <div>{`${allotedLeave} Leaves allotted`}</div>}
          {leaveTypes && <div>{`${leaveTypes} Leave types`}</div>}
        </div>
      </div>
      {showBadge && (
        <Badge
          variant="secondary"
          className="absolute bg-blue-100 text-blue-800 top-[-8px] left-[-8px]"
        >
          {row?.total_applications}
        </Badge>
      )}
    </div>
  );
};

export default EmployeeNameInfo;
