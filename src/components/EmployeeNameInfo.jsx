import { DepartmentName, DesignationName, getRandomColor } from "utils/getValuesFromTables";
const EmployeeNameInfo = ({
  name,
  department,
  position,
  id,
  leaveTypes,
  allotedLeave,
}) => {
  return (
    <div className="flex items-start pr-3">
      <div
        className= {`${getRandomColor()} text-[#FAFBFC] flex font-semibold text-md items-center justify-center rounded-full w-10 h-10`}
        style={{ minWidth: "40px" }}
      >
        {name?.toUpperCase().charAt(0)}
      </div>
      <div className="flex flex-col ml-2 whitespace-break-spaces flex-wrap">
        <div className="text-base font-bold leading-normal text-[#323333] text-left text-capitalize">
          {`${name ?? "N/A"}`}
        </div>
        <div className="text-baseGray text-left flex justify-start gap-x-5 gap-y-1 flex-wrap">
          <div>
            <DesignationName value={position} /> |{" "}
            <DepartmentName value={department} />
          </div>
          {id && <div>ID: {id}</div>}
          {allotedLeave && <div>{`${allotedLeave} Leaves allotted`}</div>}
          {leaveTypes && <div>{`${leaveTypes} Leave types`}</div>}
        </div>
      </div>
    </div>
  );
};

export default EmployeeNameInfo;
