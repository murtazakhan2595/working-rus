import * as React from "react";
import { Plus, Search } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "src/@/components/ui/popover";
import { TextInput, SelectComponent, DateInput } from "components/FormControl";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { TaskDetailBox } from "app/modules/TaskManagment/Sections";
import { Checkbox } from "../../../../src/@/components/ui/checkbox";
import { Card } from "components/ui/card";
import axios from "axios";
import { Users } from "lucide-react";
import { toast } from "react-toastify";
import { SelectMultiInputComponent } from "components/FormControl";
import { Members } from "app/modules/TaskManagment/Sections";

export default function Assignee({
  assigneeSelected,
  employees,
  onChange,
  projectMembers,
  error,
  touch,
  editMode = true,
}) {
  const [searchQuery, setSearchQuery] = React.useState("");
  // Filter labels based on search query
  const filteredEmployees = React.useMemo(() => {
    return employees?.filter(
      (employee) =>
        employee.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        projectMembers.includes(employee.value)
    );
  }, [searchQuery, employees, projectMembers]);

  const handleLabelToggle = (assigneeId) => {
    if (assigneeSelected.includes(assigneeId)) {
      // Remove the label if it already exists
      const updatedAssignee = assigneeSelected.filter(
        (id) => id !== assigneeId
      );
      onChange(updatedAssignee);
      return updatedAssignee;
    } else {
      // Add the label if it doesn't exist
      const updatedAssignee = [...assigneeSelected, assigneeId];
      onChange(updatedAssignee);
      return updatedAssignee;
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const removeMember = (member) => {
    const members = assigneeSelected || [];
    const updatedMembers = members.filter((m) => m !== member);
    onChange(updatedMembers);
  };

  return editMode ? (
    <SelectMultiInputComponent
      name="assigned_to"
      options={filteredEmployees}
      label={"Assignee"}
      value={assigneeSelected || []}
      onChange={(field, value) => {
        onChange(value);
      }}
      error={error}
      touch={touch}
      icon={<Users size={15} strokeWidth={2} />}
    />
  ) : (
    <TaskDetailBox
      dataContent={
        assigneeSelected &&
        assigneeSelected.length > 0 && (
          <ul className="flex flex-wrap gap-1">
            {assigneeSelected?.map((member, index) => (
              <div key={index}>
                <Members
                  member={member}
                  isEditMode={true}
                  removeMember={removeMember}
                />
              </div>
            ))}
          </ul>
        )
      }
      inputDataContent={
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-10 h-10 p-0 rounded-full">
              <Plus className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="start">
            <Card className="border-0 shadow-none">
              <div className="p-4 space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search Assignee"
                    className="pl-9"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                </div>
                <div className="space-y-3 max-h-[200px] overflow-y-auto scroll-smooth">
                  {filteredEmployees?.map((assignee) => (
                    <div
                      key={assignee?.value}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        checked={assigneeSelected.includes(assignee?.value)}
                        onCheckedChange={() =>
                          handleLabelToggle(assignee?.value)
                        }
                      />
                      <span
                        className={`px-3 py-1 rounded-full ${assignee?.color} inline-block`}
                      >
                        {assignee?.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </PopoverContent>
        </Popover>
      }
      editMode={true}
    />
  );
}
