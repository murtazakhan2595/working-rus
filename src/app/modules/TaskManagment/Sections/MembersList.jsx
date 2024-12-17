import Avatar from "components/ui/Avatar";
import {
  EmployeeName,
  EmployeeProfilePicture,
} from "utils/getValuesFromTables"; // Check if this uses hooks
import { getRandomColor } from "utils/renderValues";

const MembersList = ({ members, displayAll = false }) => {
  if (!members || members?.length <= 0) return null;
  const displayedMembers = displayAll ? members : members?.slice(0, 3);
  const remainingCount = members.length - displayedMembers.length;

  return (
    <div
      className={`flex ${
        !displayAll ? "-space-x-2.5" : "gap-1"
      } h-10 items-center`}
    >
      {displayedMembers?.map((member, index) => {
        const { profile_picture, name } = EmployeeProfilePicture(member);
        return (
          <Avatar
            src={profile_picture}
            alt="Avatar"
            fallbackText={name.slice(0, 2)}
            className={`${getRandomColor(name?.charAt(0))} h-8 w-8`}
            key={index}
            text={name}
          />
        );
      })}
      {remainingCount > 0 && !displayAll && (
        <span
          className="bg-plum-300 border-plum-500 h-6 w-6 flex items-center justify-center text-white text-sm rounded-full"
          key="remaining-count"
        >
          +{remainingCount}
        </span>
      )}
    </div>
  );
};

export default MembersList;
