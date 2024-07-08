import { EmployeeName } from "utils/getValuesFromTables";
import { IoIosArrowDown } from "react-icons/io";

const Members = ({ member }) => {
  const employeeName = EmployeeName({ value: member });
  const name = employeeName.props.children;
  return (
    <div className="flex items-center pr-3 bg-[#EEEEF0] rounded-full" title={name}>
      <div
        className="bg-[#BE24A5] text-[#FAFBFC] flex font-semibold text-md items-center justify-center rounded-full w-10 h-10"
        style={{ minWidth: "40px" }}
      >
        {name?.toUpperCase().charAt(0)}
      </div>
      <div className="flex flex-col mx-2 whitespace-break-spaces flex-wrap">
        <div className="text-base font-bold leading-normal text-[#323333] text-left text-capitalize">
          <IoIosArrowDown/>
        </div>
      </div>
    </div>
  );
};

export default Members;
