import * as React from "react";
import { Plus, Search } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../../src/@/components/ui/popover";
import {
    TextInput,
    SelectComponent,
    DateInput,
  } from "components/form-control.jsx";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { Label } from "../../../../src/@/components/ui/label";
import { Checkbox } from "../../../../src/@/components/ui/checkbox";
import { Card } from "components/ui/card";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getDarkerTextColor } from "../Boards/Sections/getTaskStatus";
import { Members } from "app/modules/TaskManagment/Sections";


export default function Assignee({
  assigneeSelected,
  removeMember,
  employees,
  onChange,
  errors,
  touched,
}) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedAssignee, setSelectedLabels] = React.useState([]);

  // Filter labels based on search query
  const filteredEmployees = React.useMemo(() => {
    return employees?.filter((employee) =>
        employee.name.toLowerCase().includes(searchQuery.toLowerCase())
);
  }, [searchQuery, employees]);

  const handleLabelToggle = (labelId) => {
    setSelectedLabels((prev) => {
      const updatedLabels = prev.includes(labelId)
        ? prev.filter((id) => id !== labelId)
        : [...prev, labelId];

      onChange(updatedLabels);
      return updatedLabels;
    });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className=" max-w-sm flex" >
      <div style={{ maxWidth: "85%" }}>
        <ul className="flex flex-wrap gap-2">
          {assigneeSelected &&
            assigneeSelected.length > 0 &&
            assigneeSelected?.map((member, index) => (
              <div key={index}>
                <Members
                  member={member}
                  isEditMode={true}
                  removeMember={removeMember}
                />
              </div>
            ))}
        </ul>
      </div>
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
                  placeholder="Search Label"
                  className="pl-9"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
              <div className="space-y-3 max-h-[200px] overflow-y-auto scroll-smooth">
                {filteredEmployees?.map((assignee) => (
                  <div key={assignee?.value} className="flex items-center space-x-2">
                    <Checkbox
                      checked={selectedAssignee.includes(assignee?.value)}
                      onCheckedChange={() => handleLabelToggle(assignee?.value)}
                    />
                    <span
                      className={`px-3 py-1 rounded-full ${
                        assignee?.color
                      } inline-block`}
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
    </div>
  );
}
