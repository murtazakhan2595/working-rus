import { DepartmentName, DesignationName } from "utils/getValuesFromTables";
import {getRandomColor} from "utils/renderValues"
import { Avatar, AvatarImage, AvatarFallback } from "../src/@/components/ui/avatar"

// const combineFLName = employee?.first_name?.charAt(0).toUpperCase() +  employee?.last_name?.charAt(0).toUpperCase() 
const EmployeeNameInfo = ({
  name,
  department,
  position,
  id,
  leaveTypes,
  allotedLeave,
}) => {
  return (
    <div className="flex items-center">
      <Avatar className="hidden h-14 w-14 sm:inline">
                <AvatarImage src="/placeholder-user.jpg" alt="Avatar" />
                <AvatarFallback className="flex items-center justify-center rounded-full border-plum-500 bg-plum-300">{name?.charAt(0).toUpperCase() }</AvatarFallback>
              </Avatar>
      
      <div className="flex flex-col flex-wrap ml-2 whitespace-break-spaces">
        <div className="font-medium">
          {`${name ?? "N/A"}`}
        </div>
        <div className="hidden text-sm text-muted-foreground md:inline">
          <div>
            <DesignationName value={position} /> |{" "}
            <DepartmentName value={department} />
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
