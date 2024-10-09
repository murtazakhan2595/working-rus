import { DepartmentName, DesignationName } from "utils/getValuesFromTables";
import {getRandomColor} from "utils/renderValues"
import Avatar from "./ui/Avatar";

// const combineFLName = employee?.first_name?.charAt(0).toUpperCase() +  employee?.last_name?.charAt(0).toUpperCase() 
const EmployeeNameInfo = ({
  name,
  department,
  position,
  id,
  leaveTypes,
  allotedLeave,
  showPosition = true
}) => {
  return (
    <div className="flex items-center">
      <Avatar
       src={'/placeholder-user.jpg'}
       alt="Avatar"
       fallbackText={name?.charAt(0)}
       className={`${getRandomColor(name?.charAt(0))} h-14 w-14`}
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
    </div>
  );
};

export default EmployeeNameInfo;
