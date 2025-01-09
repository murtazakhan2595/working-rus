import Avatar from "components/ui/Avatar";
import { useSelector } from "react-redux";
import { getRandomColor } from "utils/renderValues";

const MembersList = ({ members, displayAll = false }) => {
  // Get all employees data once at the component level
  const employees = useSelector((state) => state.emp.employees_detail);

  if (!members || members?.length <= 0) return null;

  const displayedMembers = displayAll ? members : members?.slice(0, 3);
  const remainingCount = members.length - displayedMembers.length;

  // Helper function to get employee profile
  const getEmployeeProfile = (id) => {
    const employee = employees.find((option) => option.value === parseInt(id));
    if (employee) {
      const employeeProfilePicture = employee.profile_picture ?? null;
      return {
        profile_picture: employeeProfilePicture,
        name: `${employee?.first_name} ${employee?.last_name}`,
      };
    }
    return {
      profile_picture: null,
      name: "N/A",
    };
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`flex ${
          !displayAll ? "-space-x-2.5" : "gap-1"
        } h-10 items-center`}
      >
        {displayedMembers?.map((member, index) => {
          const { profile_picture, name } = getEmployeeProfile(member);
          return (
            <Avatar
              key={index}
              src={profile_picture}
              alt="Avatar"
              fallbackText={name.slice(0, 2)}
              className={`${getRandomColor(name?.charAt(0))} h-8 w-8`}
              text={name}
            />
          );
        })}
      </div>
      {remainingCount > 0 && !displayAll && (
        <span
          className="text-plum-1100 h-6 w-6 flex items-center justify-center text-sm rounded-full"
          key="remaining-count"
        >
          +{remainingCount}
        </span>
      )}
    </div>
  );
};

export default MembersList;
