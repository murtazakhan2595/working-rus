import { EmployeeName } from "utils/getValuesFromTables";
import { getRandomColor } from "utils/renderValues";

const MembersList = ({ members }) => {
  if (!members) return <></>;
  const displayedMembers = members.slice(0, 3);
  const remainingCount = members.length - displayedMembers.length;
  return (
    <div className="flex -space-x-2.5 h-10 items-center">
      {displayedMembers.map((member) => {
        const employeeName = EmployeeName({ value: member, length: 2 });
        const name = employeeName.props.children;
        return (
          <span
            className={`${getRandomColor(
              name?.charAt(0)
            )} font-lato flex justify-center items-center text-[10.5px] font-bold text-[#FAFBFC] w-8 h-8 rounded-full`}
            key={member}
          >
            {name}
          </span>
        );
      })}
      {remainingCount > 0 && (
        <span
          className="bg-[#B6E5F9] font-lato flex justify-center items-center text-[10.5px] font-bold text-[#0D2282] w-8 h-8 rounded-full"
          key="remaining-count"
        >
          +{remainingCount}
        </span>
      )}
    </div>
  );
};

export default MembersList;
