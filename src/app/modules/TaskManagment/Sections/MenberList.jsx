import Avatar from "components/ui/Avatar";
import { EmployeeName } from "utils/getValuesFromTables";
import { getRandomColor } from "utils/renderValues";
// import { Avatar, AvatarImage, AvatarFallback } from "../../../../src/@/components/ui/avatar"
const MembersList = ({ members }) => {
  if (!members || members?.length <= 0) return <></>;
  const displayedMembers = members.slice(0, 3);
  const remainingCount = members.length - displayedMembers.length;
  return (
    <>
      <div className="flex -space-x-2.5 h-10 items-center">
        {displayedMembers.map((member) => {
          const employeeName = EmployeeName({ value: member, length: 1 });
          const name = employeeName.props.children;
          return (
            <>
              {/* <span>{name}</span> */}
              <Avatar
                src="/placeholder-user.jpg"
                alt="Avatar"
                fallbackText={name}
                className={`${getRandomColor(name?.charAt(0))} h-8 w-8`}
                key={member}
              /> 
            </>
          );
        })}
        {remainingCount > 0 && (
          <span className="bg-plum-300 border-plum-500 h-6 w-6" key="remaining-count">
            +{remainingCount}
          </span>
        )}
      </div>
    </>
  );
};

export default MembersList;
