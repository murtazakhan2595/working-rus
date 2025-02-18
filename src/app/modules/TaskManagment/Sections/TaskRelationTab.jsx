import { Link, AlarmClock, Timer } from "lucide-react";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "src/@/components/ui/dialog.jsx";
import { Input } from "components/ui/input";
import { ScrollArea } from "src/@/components/ui/scroll-area";
import { MdClose } from "react-icons/md";
import { Badge } from "components/ui/badge";
import { getTaskByprojectId } from "app/hooks/taskManagment";

// Constants for relation types
const RELATION_TYPES = {
  NONE: "none", // Changed from LINK to NONE
  BLOCKER: "blocker",
  WAITING_ON: "waiting", // Changed from WAITING to WAITING_ON
};

const TYPE_LABELS = {
  [RELATION_TYPES.NONE]: {
    // Changed from LINK to NONE
    title: "Link", // Keep the display title as "Link"
    description:
      "Relate to each other but aren't actually dependent on the other",
    icon: Link,
  },
  [RELATION_TYPES.BLOCKER]: {
    title: "Blocker",
    description: "Tasks that can't start until this task is completed",
    icon: AlarmClock,
  },
  [RELATION_TYPES.WAITING_ON]: {
    // Changed from WAITING to WAITING_ON
    title: "Waiting On",
    description: "Tasks that must be completed before this task",
    icon: Timer,
  },
};

const TaskRelationTab = ({
  relationsList = [],
  onChange,
  projectId,
  taskId,
  error,
  touch,
  editMode = true,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [taskList, setTaskList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [relationsByType, setRelationsByType] = useState({
    [RELATION_TYPES.NONE]: [], // Changed from LINK to NONE
    [RELATION_TYPES.BLOCKER]: [],
    [RELATION_TYPES.WAITING_ON]: [], // Changed from WAITING to WAITING_ON
  });

  // Fetch tasks from API
  const fetchTasks = async (isMounted) => {
    try {
      const response = await getTaskByprojectId(projectId);
      if (isMounted) {
        const tasks = response.results || [];
        const finalTaskList = taskId
          ? tasks.filter((obj) => obj.id !== taskId)
          : tasks;
        setTaskList(finalTaskList);
        setFilteredTasks(finalTaskList);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (projectId) {
      fetchTasks(isMounted);
    }
    return () => {
      isMounted = false;
    };
  }, [projectId]);

  // In TaskRelationTab component
  useEffect(() => {
    const categorizedRelations = {
      [RELATION_TYPES.NONE]: [],
      [RELATION_TYPES.BLOCKER]: [],
      [RELATION_TYPES.WAITING_ON]: [],
    };

    if (relationsList?.length > 0) {
      relationsList.forEach((relation) => {
        const taskId = relation.id;
        // Convert relation type to lowercase for comparison
        const type = relation.relation_type?.toLowerCase();

        // Map the relation types correctly
        let mappedType;
        if (type === "none") {
          mappedType = "none";
        } else if (type === "blocker") {
          mappedType = "blocker";
        } else if (type === "waiting_on") {
          mappedType = "waiting"; // This matches our RELATION_TYPES.WAITING_ON
        }

        if (mappedType && categorizedRelations[mappedType]) {
          categorizedRelations[mappedType].push(taskId);
        }
      });
    }

    setRelationsByType(categorizedRelations);
  }, [relationsList]);

  useEffect(() => {
    const allSelectedIds = Object.values(relationsByType).flat();
    const filtered = taskList.filter(
      (task) =>
        task.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !allSelectedIds.includes(task.id)
    );
    setFilteredTasks(filtered);
  }, [searchTerm, taskList, relationsByType]);

  const handleTaskSelect = (selectedTask) => {
    if (!selectedType) return;

    const updatedRelations = {
      ...relationsByType,
      [selectedType]: [...relationsByType[selectedType], selectedTask.id],
    };
    setRelationsByType(updatedRelations);

    // Format for relation_ship array
    const formattedRelations = Object.entries(updatedRelations).flatMap(
      ([type, taskIds]) => {
        // Map the type to the exact backend enum string
        const backendType =
          type === "waiting" ? "WAITING_ON" : type.toUpperCase();
        return taskIds.map((id) => ({
          id,
          relation_type: backendType,
        }));
      }
    );

    onChange(formattedRelations);
    setIsDialogOpen(false);
    setSearchTerm("");
  };

const handleRemoveRelation = (type, taskId) => {
  const updatedRelations = {
    ...relationsByType,
    [type]: relationsByType[type].filter((id) => id !== taskId),
  };
  setRelationsByType(updatedRelations);

  // Format for relation_ship array
  const formattedRelations = Object.entries(updatedRelations).flatMap(
    ([type, taskIds]) => {
      // Map the type to the exact backend enum string
      const backendType =
        type === "waiting" ? "WAITING_ON" : type.toUpperCase();
      return taskIds.map((id) => ({
        id,
        relation_type: backendType,
      }));
    }
  );

  onChange(formattedRelations);
};

  // Render related tasks for a specific type
  const renderRelatedTasks = (type) => {
    const tasks = relationsByType[type];
    if (!tasks?.length) return null;

    return (
      <div className="pl-8 mt-2 space-y-2">
        {tasks.map((relatedTaskId) => {
          const task = taskList.find((t) => t.id === relatedTaskId);
          if (!task) return null;
          return (
            <div
              key={relatedTaskId}
              className="flex items-center justify-between p-2 bg-gray-100 rounded-lg shadow-sm w-fit gap-2 group"
            >
              <span className="text-sm text-zinc-600">
                {task.name || "Task Title (N/A)"}
              </span>
              {editMode && (
                <MdClose
                  className="w-4 h-4 text-gray-400 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleRemoveRelation(type, relatedTaskId)}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // Rest of the component remains the same...
  return (
    <>
      <div className="space-y-4">
        {Object.values(RELATION_TYPES).map((type) => (
          <div key={type} className="space-y-2">
            <div
              className="flex items-center gap-3 rounded-lg cursor-pointer border border-zinc-200 py-2 px-2 hover:bg-gray-50 relative group"
              onClick={() => {
                if (editMode) {
                  setSelectedType(type);
                  setIsDialogOpen(true);
                }
              }}
            >
              {React.createElement(TYPE_LABELS[type].icon, {
                className: "w-5 h-5 flex-shrink-0 text-zinc-500",
              })}
              <div className="text-sm text-zinc-500">
                <span className="font-medium mr-2 text-zinc-900">
                  {TYPE_LABELS[type].title}
                </span>
                {TYPE_LABELS[type].description}
              </div>
              {relationsByType[type]?.length > 0 && (
                <Badge variant="secondary" className="absolute right-2">
                  {relationsByType[type].length}
                </Badge>
              )}
            </div>
            {renderRelatedTasks(type)}
          </div>
        ))}
      </div>

      <Dialog
        open={isDialogOpen}
        onOpenChange={() => {
          setIsDialogOpen(false);
          setSearchTerm("");
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedType && `Select ${TYPE_LABELS[selectedType].title} Task`}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
            <ScrollArea className="h-[300px] w-full rounded-md border p-2">
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center p-2 hover:bg-gray-100 rounded-md cursor-pointer"
                    onClick={() => handleTaskSelect(task)}
                  >
                    <span className="text-sm">{task.name}</span>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  {searchTerm
                    ? "No matching tasks found"
                    : "No available tasks"}
                </div>
              )}
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TaskRelationTab;
