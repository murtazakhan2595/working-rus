import { DepartmentName, DesignationName } from "utils/getValuesFromTables";
const EmployeeNameInfo = ({
  name,
  department,
  position,
  id,
  leaveTypes,
  allotedLeave,
}) => {
  return (
    <div className="flex items-start">
      <div
        className="bg-[#BE24A5] text-[#FAFBFC] flex font-semibold text-md items-center justify-center rounded-full w-10 h-10"
        style={{ minWidth: "40px" }}
      >
        {name?.toUpperCase().charAt(0)}
      </div>
      <div className="flex flex-col ml-2">
        <div className="text-base font-bold leading-normal text-[#323333] text-left text-capitalize">
          {`${name ?? "N/A"}`}
        </div>
        <div className="text-baseGray text-left flex justify-between gap-3">
          <div>
            <DesignationName value={position} /> |{" "}
            <DepartmentName value={department} />
          </div>
          <div>ID: {id}</div>
          <div>{allotedLeave} Leaves allotted</div>
          <div>{leaveTypes} Leave types</div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeNameInfo;
