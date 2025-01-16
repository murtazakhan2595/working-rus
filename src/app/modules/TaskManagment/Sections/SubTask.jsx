import { useState } from "react";
import { Pencil, UserPlus, X, Plus, Search } from "lucide-react";
import { TaskDetailBox } from "app/modules/TaskManagment/Sections";
import { Checkbox } from "src/@/components/ui/checkbox";
import { Button } from "components/ui/button";
import { Card } from "components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "src/@/components/ui/popover";
import { Input } from "components/ui/input";
import MembersList from "./MembersList";

export default function Subtasks({
  items,
  onChange,
  editMode = true,
  employees = [],
  projectMembers = [],
  taskId,
}) {
  const [newItem, setNewItem] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isAssigneeOpen, setIsAssigneeOpen] = useState(false);
  const [newItemAssignees, setNewItemAssignees] = useState([]); // Array for multiple assignees
  const [isMainPopoverOpen, setIsMainPopoverOpen] = useState(false);

  console.log("tasks", items);
  const filteredEmployees = employees?.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      projectMembers.includes(employee.value)
  );

  const handleEdit = (index) => {
    onChange(
      items.map((el, i) => (i === index ? { ...el, isEditing: true } : el))
    );
  };

  const handleEditSubmit = (index, newDescription) => {
    onChange(
      items.map((el, i) =>
        i === index
          ? { ...el, description: newDescription, isEditing: false }
          : el
      )
    );
  };

  const handleRemove = async (index) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const handleCheck = (index) => {
    onChange(
      items.map((el, i) =>
        i === index ? { ...el, is_completed: !el.is_completed } : el
      )
    );
  };

  const handleAssign = (assignee) => {
    if (selectedIndex !== null) {
      // Assigning to existing subtask
      onChange(
        items.map((el, i) =>
          i === selectedIndex
            ? {
                ...el,
                assigned_to: el.assigned_to
                  ? [...el.assigned_to, assignee.value]
                  : [assignee.value],
              }
            : el
        )
      );
    } else if (newItem.trim()) {
      // For new task, add to array of assignees
      setNewItemAssignees((prev) =>
        prev.includes(assignee.value) ? prev : [...prev, assignee.value]
      );
    }
    setIsAssigneeOpen(false);
    setSelectedIndex(null);
  };

  return (
    <TaskDetailBox
      dataContent={
        items &&
        items.length > 0 && (
          <div className="flex flex-col w-full">
            {items.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-2 p-2 rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-2 flex-grow">
                  <Checkbox
                    checked={item.is_completed}
                    onCheckedChange={() => {
                      if (editMode) handleCheck(index);
                    }}
                    disabled={!editMode}
                  />
                  {item.isEditing ? (
                    <Input
                      defaultValue={item.description}
                      className="flex-grow"
                      onBlur={(e) => handleEditSubmit(index, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleEditSubmit(index, e.target.value);
                        }
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-between flex-grow">
                      <span
                        className={
                          item.is_completed
                            ? "line-through text-muted-foreground"
                            : ""
                        }
                      >
                        {item.description}
                      </span>
                      {item.assigned_to && (
                        <MembersList
                          members={item?.assigned_to}
                          displayAll={true}
                        />
                      )}
                    </div>
                  )}
                </div>
                {editMode && (
                  <div className="flex items-center gap-2">
                    {!item.isEditing && (
                      <>
                        <Popover
                          open={isAssigneeOpen && selectedIndex === index}
                          onOpenChange={(open) => {
                            if (!open) {
                              setIsAssigneeOpen(false);
                              setSelectedIndex(null);
                            }
                          }}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-gray-500 hover:text-gray-700"
                              onClick={() => {
                                setSelectedIndex(index);
                                setIsAssigneeOpen(true);
                              }}
                            >
                              <UserPlus className="h-4 w-4" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-80 p-0" align="end">
                            <Card className="border-0 shadow-none">
                              <div className="p-4 space-y-4">
                                <div className="relative">
                                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                  <Input
                                    placeholder="Search Assignee"
                                    className="pl-9"
                                    value={searchQuery}
                                    onChange={(e) =>
                                      setSearchQuery(e.target.value)
                                    }
                                  />
                                </div>
                                <div className="space-y-3 max-h-[200px] overflow-y-auto scroll-smooth">
                                  {filteredEmployees?.map((assignee) => (
                                    <div
                                      key={assignee?.value}
                                      className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                                      onClick={() => handleAssign(assignee)}
                                    >
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
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-primary hover:text-primary"
                          onClick={() => handleEdit(index)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleRemove(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      }
      inputDataContent={
        <Popover open={isMainPopoverOpen} onOpenChange={setIsMainPopoverOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-10 h-10 p-0 rounded-full">
              <Plus className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="start">
            <div className="p-4 space-y-4">
              <div className="relative">
                <Input
                  placeholder="Enter subtask"
                  className="pr-10"
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                />
                <Popover
                  open={isAssigneeOpen && selectedIndex === null}
                  onOpenChange={(open) => {
                    if (!open) {
                      setIsAssigneeOpen(false);
                      setSelectedIndex(null);
                    }
                  }}
                >
                  <PopoverTrigger asChild>
                    <button
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-800 hover:text-gray-900 focus:outline-none"
                      onClick={() => {
                        setSelectedIndex(null);
                        setIsAssigneeOpen(true);
                      }}
                    >
                      <UserPlus size={16} />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-0" align="end">
                    <Card className="border-0 shadow-none">
                      <div className="p-4 space-y-4">
                        <div className="relative">
                          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="Search Assignee"
                            className="pl-9"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </div>
                        <div className="space-y-3 max-h-[200px] overflow-y-auto scroll-smooth">
                          {filteredEmployees?.map((assignee) => (
                            <div
                              key={assignee?.value}
                              className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                              onClick={() => handleAssign(assignee)}
                            >
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
              </div>

              <div className="flex items-center justify-between">
                <Button
                  className=""
                  onClick={() => {
                    if (newItem.trim()) {
                      const newItemObj = {
                        name: newItem,
                        is_completed: false,
                        assigned_to:
                          newItemAssignees.length > 0 ? newItemAssignees : null,
                        tasks: taskId,
                      };
                      onChange([...(items || []), newItemObj]);
                      setNewItem("");
                      setNewItemAssignees([]); // Reset the assignees array
                      setIsMainPopoverOpen(false);
                    }
                  }}
                >
                  Add
                </Button>
                {newItemAssignees.length > 0 && (
                  <div className="flex items-center gap-2">
                    <MembersList members={newItemAssignees} displayAll={true} />
                  </div>
                )}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      }
      editMode={editMode}
    />
  );
}
