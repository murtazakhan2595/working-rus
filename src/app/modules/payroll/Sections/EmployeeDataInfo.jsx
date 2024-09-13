import Avatar from "components/ui/Avatar";
import { DepartmentName, DesignationName } from "utils/getValuesFromTables";
import { getRandomColor } from "utils/renderValues";


const EmployeeDataInfo = ({ name, email, src }) => {
  return (
    <div className="flex items-center">
      <Avatar className="h-14 w-14" src={src} fallbackText={name?.charAt(0).toUpperCase()} alt={name?.charAt(0).toUpperCase()}/>

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
