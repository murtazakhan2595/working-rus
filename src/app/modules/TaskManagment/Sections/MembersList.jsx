import * as React from "react";
import Avatar from "components/ui/Avatar";
import { useSelector } from "react-redux";
import { GetUser } from "utils/getValuesFromTables";
import { EmployeeOverview } from "components";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "src/@/components/ui/popover";
import { Card } from "components/ui/card";
import { Search } from "lucide-react";
import { Input } from "components/ui/input";
import { MdClose } from "react-icons/md";
import { ScrollArea } from "src/@/components/ui/scroll-area";

// Wrap the component with React.memo for optimization with custom equality check
const MembersList = ({
  members = [],
  removeMember,
  displayAll = false,
  onMemberClick = () => {},
}) => {
  // Get all employees data once at the component level
  const [searchQuery, setSearchQuery] = React.useState("");
  const employees = useSelector((state) => state.emp.employees_detail);
  const userProfile = useSelector((state) => state.user.userProfile);
  const filteredMembers = React.useMemo(() => {
    return employees?.filter(
      (employee) =>
        employee.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        members.includes(employee.value)
    );
  }, [searchQuery, employees, members]);

  const displayedMembers = displayAll ? members : members?.slice(0, 3);
  const remainingCount = members.length - displayedMembers.length;

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
          {displayedMembers?.map((member) => (
            <div key={member}>
              <MembersAvatar member={member} />
            </div>
          ))}
          {remainingCount > 0 && !displayAll && (
            <span
              className="text-plum-1100 h-6 w-6 flex items-center justify-center text-sm rounded-full"
              style={{ marginLeft: "1px" }}
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
            {remainingCount > 0 && (
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search Member"
                  className="pl-9"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
            )}
            <ScrollArea className="[&>div>div[style]]:!block">
              <div className="pr-2 space-y-3 max-h-[200px]">
                {filteredMembers.map((member) => {
                  return (
                    <div
                      key={member.id}
                      className="flex justify-between w-full items-center cursor-pointer"
                    >
                      <div onClick={(e) => onMemberClick(e, member)}>
                        <EmployeeOverview
                          id={member.id}
                          showEmail={true}
                          showPosition={true}
                        />
                      </div>
                      {removeMember && userProfile?.role !== 4 && (
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
            </ScrollArea>
          </div>
        </Card>
      </PopoverContent>
    </Popover>
  );
};

const MembersAvatar = React.memo(({ member = null }) => {
  if (!member) return null;
  const userProfile = GetUser(member);
  if (!userProfile) return null;

  return (
    <Avatar
      key={member}
      src={userProfile.profile_picture}
      alt="Avatar"
      fallbackText={userProfile.name_initials}
      className={`h-8 w-8`}
      text={userProfile.name}
    />
  );
});

export default MembersList;
