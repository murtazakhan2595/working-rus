import Avatar from "components/ui/Avatar";
import { EmployeeID } from "utils/getValuesFromTables";
import { DepartmentName, DesignationName } from "utils/getValuesFromTables";
import { getRandomColor } from "utils/renderValues";


const EmployeeDataInfo = ({ name, email, src, id, designation, department }) => {
  return (
    <div className="flex items-center">
      <Avatar
        className="h-12 w-12"
        src={src}
        fallbackText={name?.charAt(0).toUpperCase()}
        alt={name?.charAt(0).toUpperCase()}
      />

      <div className="flex flex-col flex-wrap ml-2 whitespace-break-spaces">
        {id && (
          <div className="text-neutral-1200 text-xs font-normal">
            <EmployeeID value={id} />
          </div>
        )}
        <div className="font-medium capitalize">{`${name ?? "N/A"}`}</div>
        {email &&<div className="hidden text-sm text-muted-foreground md:inline">
          <div>{email}</div>
        </div>}
        {designation &&<div className="hidden text-sm text-muted-foreground md:inline">
          <div>{designation}</div>
        </div>}
        {department &&<div className="hidden text-sm text-muted-foreground md:inline">
          <div>{department}</div>
        </div>}
      </div>
    </div>
  );
};

export default EmployeeDataInfo;
