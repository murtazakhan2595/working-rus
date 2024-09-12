import { DepartmentName, DesignationName } from "utils/getValuesFromTables";
import { getRandomColor } from "utils/renderValues";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "../../../../src/@/components/ui/avatar";

const EmployeeDataInfo = ({ name, email }) => {
  return (
    <div className="flex items-center">
      <Avatar className="hidden h-14 w-14 sm:inline">
        <AvatarImage src="/placeholder-user.jpg" alt="Avatar" />
        <AvatarFallback className="flex items-center justify-center rounded-full border-plum-500 bg-plum-300">
          {name?.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="flex flex-col flex-wrap ml-2 whitespace-break-spaces">
        <div className="font-medium capitalize">{`${name ?? "N/A"}`}</div>
        <div className="hidden text-sm text-muted-foreground md:inline">
          <div>{email}</div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDataInfo;
