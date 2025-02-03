import * as React from "react";
import Avatar from "components/ui/Avatar";
import { useSelector } from "react-redux";
import { getRandomColor } from "utils/renderValues";
import { EmployeeNameInfo } from "components";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "src/@/components/ui/popover";
import { Card } from "components/ui/card";
import { Search } from "lucide-react";
import { Input } from "components/ui/input";
import { MdClose } from "react-icons/md";

// Custom comparison function for React.memo
const areEqual = (prevProps, nextProps) => {
  return (
    prevProps.members === nextProps.members &&
    prevProps.removeMember === nextProps.removeMember &&
    prevProps.displayAll === nextProps.displayAll
  );
};

// Wrap the component with React.memo for optimization with custom equality check
const MembersList = React.memo(
  ({ members, removeMember, displayAll = false }) => {
    // Get all employees data once at the component level
    const [searchQuery, setSearchQuery] = React.useState("");
    const employees = useSelector((state) => state.emp.employees_detail);

    const filteredMembers = React.useMemo(() => {
      return employees?.filter(
        (employee) =>
          employee.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          members.includes(employee.value)
      );
    }, [searchQuery, employees, members]);

    const displayedMembers = displayAll ? members : members?.slice(0, 3);
    const remainingCount = members.length - displayedMembers.length;

    // Helper function to get employee profile
    const getEmployeeProfile = (id) => {
      const employee = employees.find(
        (option) => option.value === parseInt(id)
      );
      if (employee) {
        const employeeProfilePicture = employee.profile_picture ?? null;
        return {
          profile_picture: employeeProfilePicture,
          name: `${employee?.first_name} ${employee?.last_name}`,
          name_initials: `${employee?.first_name?.charAt(0) || ""}${
            employee?.last_name?.charAt(0) || ""
          }`,
        };
      }
      return {
        profile_picture: null,
        name: "N/A",
      };
    };

    const handleSearchChange = (e) => {
      setSearchQuery(e.target.value);
    };

    if (!members || members?.length <= 0) return null;

    return (
      <Popover>
        <PopoverTrigger asChild>
          <div
            className={`flex ${
              !displayAll ? "-space-x-2.5" : "gap-1"
            } h-auto items-center flex-wrap cursor-pointer`}
          >
            {displayedMembers?.map((member, index) => {
              const { profile_picture, name, name_initials } =
                getEmployeeProfile(member);
              return (
                <Avatar
                  key={index}
                  src={profile_picture}
                  alt="Avatar"
                  fallbackText={name_initials}
                  className={`h-8 w-8`}
                  text={name}
                />
              );
            })}
            {remainingCount > 0 && !displayAll && (
              <span
                className="text-plum-1100 h-6 w-6 flex items-center justify-center text-sm rounded-full"
                style={{marginLeft:'1px'}}
                key="remaining-count"
              >
                +{remainingCount}
              </span>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="start">
          <Card className="border-0 shadow-none">
            <div className="p-4 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search Member"
                  className="pl-9"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
              <div className="space-y-3 max-h-[200px] overflow-y-auto scroll-smooth">
                {filteredMembers.map((member) => {
                  return (
                    <div
                      key={member.id}
                      className="flex justify-between w-full items-center"
                    >
                      <EmployeeNameInfo
                        showPosition={true}
                        showDepartment={true}
                        department={member.department_name}
                        position={member.department_position}
                        name={member.name}
                      />
                      {removeMember && (
                        <MdClose
                          className="w-5 h-5 text-gray-700 cursor-pointer"
                          onClick={() => {
                            const updatedMember = members.filter(
                              (obj) => obj !== member.id
                            );
                            removeMember(updatedMember);
                          }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        </PopoverContent>
      </Popover>
    );
  },
  areEqual
); // Use custom equality check

export default MembersList;
