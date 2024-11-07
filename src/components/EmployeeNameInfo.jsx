import { DepartmentName, DesignationName } from "utils/getValuesFromTables";
import {getRandomColor} from "utils/renderValues"
import Avatar from "./ui/Avatar";
import { Badge } from "./ui/badge";

// const combineFLName = employee?.first_name?.charAt(0).toUpperCase() +  employee?.last_name?.charAt(0).toUpperCase() 
const EmployeeNameInfo = ({
  name,
  department,
  position,
  id,
  leaveTypes,
  allotedLeave,
  showPosition = true,
  className,
  showBadge=false,
  row
}) => {
  return (
    <div className={`flex items-center ${className}`}>
      <Avatar
       src={'/placeholder-user.jpg'}
       alt="Avatar"
       fallbackText={name?.charAt(0)}
       className={`${getRandomColor(name?.charAt(0))} h-12 w-12`}
      />
      
      <div className="flex flex-col flex-wrap ml-2 whitespace-break-spaces">
        <div className="font-medium">
          {`${name ?? "N/A"}`}
        </div>
        <div className="hidden text-sm text-muted-foreground md:inline">
          <div>
            <DesignationName value={position} />
            {showPosition && <span> | <DepartmentName value={department} /> </span>}
          </div>
          {id && <div className="hidden sm:inline">ID: {id}</div>}
          {allotedLeave && <div>{`${allotedLeave} Leaves allotted`}</div>}
          {leaveTypes && <div>{`${leaveTypes} Leave types`}</div>}
        </div>
      </div>
      {showBadge && <Badge
            variant="secondary"
            className="absolute bg-blue-100 text-blue-800 top-[-8px] left-[-8px]"
          >
            {row?.total_applications}
          </Badge>}
    </div>
  );
};

export default EmployeeNameInfo;
