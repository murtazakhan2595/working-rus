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
import { useNavigate, useParams } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "src/@/components/ui/tooltip";
import moment from "moment";

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
  targetRelationsList = [],
  setRemovedRelationships,
  onChange,
  projectId,
  taskId,
  boardId,
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

  const { viewStyle } = useParams();
  const navigate = useNavigate();
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

    // Handle source relationships
    relationsList?.forEach((relation) => {
      const otherTaskId = relation.target_task_id;
      const type = relation.relation_choices
        .toLowerCase()
        .replace(" on", "_on");

      // Map the types to our display categories
      let mappedType;
      if (type === "none") {
        mappedType = "none";
      } else if (type === "blocker") {
        mappedType = "blocker";
      } else if (type === "waiting_on") {
        mappedType = "waiting";
      }

      if (
        mappedType &&
        !categorizedRelations[mappedType].includes(otherTaskId)
      ) {
        categorizedRelations[mappedType].push(otherTaskId);
      }
    });

    // Handle target relationships
    targetRelationsList?.forEach((relation) => {
      const otherTaskId = relation.source_task_id;
      const type = relation.relation_choices
        .toLowerCase()
        .replace(" on", "_on");

      // For target relationships, we need to show them in the appropriate category
      let mappedType;
      if (type === "none") {
        mappedType = "none";
      } else if (type === "blocker") {
        mappedType = "waiting"; // If other task blocks us, we're waiting on it
      } else if (type === "waiting_on") {
        mappedType = "blocker"; // If other task is waiting on us, we're blocking it
      }

      if (
        mappedType &&
        !categorizedRelations[mappedType].includes(otherTaskId)
      ) {
        categorizedRelations[mappedType].push(otherTaskId);
      }
    });

    setRelationsByType(categorizedRelations);
  }, [relationsList, targetRelationsList]);

  useEffect(() => {
    const allSelectedIds = Object.values(relationsByType).flat();

    const filtered = taskList.filter((task) => {
      if (!searchTerm) return !allSelectedIds.includes(task.id);

      const lowercaseSearch = searchTerm.toLowerCase();

      // Check if task name contains the search term
      const nameMatch = task.name.toLowerCase().includes(lowercaseSearch);

      // Check for ID-based search
      let idMatch = false;

      // Handle raw ID search (e.g. "481")
      if (/^\d+$/.test(searchTerm)) {
        idMatch = task.id.toString() === searchTerm;
      }

      // Handle prefixed ID search (e.g. "T-000481")
      else if (
        /^[A-Za-z]-\d+$/.test(searchTerm) ||
        /^[A-Za-z]{1,2}-\d+$/.test(searchTerm)
      ) {
        const idPart = searchTerm.split("-")[1];
        idMatch = task.id.toString() === idPart;
      }

      // Format with asterisks (e.g. **T-000481**)
      else if (/\*\*[A-Za-z]-\d+\*\*/.test(searchTerm)) {
        const idPart = searchTerm.replace(/\*/g, "").split("-")[1];
        idMatch = task.id.toString() === idPart;
      }

      return (nameMatch || idMatch) && !allSelectedIds.includes(task.id);
    });

    setFilteredTasks(filtered);
  }, [searchTerm, taskList, relationsByType]);

  const handleTaskSelect = (selectedTask) => {
    if (!selectedType) return;

    const updatedRelations = {
      ...relationsByType,
      [selectedType]: [...relationsByType[selectedType], selectedTask.id],
    };
    setRelationsByType(updatedRelations);

    // Create both source and target formatted relations
    let sourceRelation = {
      source_task_id: taskId,
      target_task_id: selectedTask.id,
      relation_choices:
        selectedType === "waiting" ? "WAITING_ON" : selectedType.toUpperCase(),
    };

    let targetRelation;

    // Handle different types of relationships
    if (selectedType === "none") {
      // For NONE (Link), create identical relationship in reverse
      targetRelation = {
        source_task_id: selectedTask.id,
        target_task_id: taskId,
        relation_choices: "NONE",
      };
    } else if (selectedType === "blocker") {
      // If current task blocks target task, target task is waiting on current task
      targetRelation = {
        source_task_id: selectedTask.id,
        target_task_id: taskId,
        relation_choices: "WAITING ON",
      };
    } else if (selectedType === "waiting") {
      // If current task is waiting on target task, target task blocks current task
      targetRelation = {
        source_task_id: selectedTask.id,
        target_task_id: taskId,
        relation_choices: "BLOCKER",
      };
    }

    // Call onChange with both source and target relationships
    onChange(
      [...relationsList, sourceRelation], // Update source relationships
      [...targetRelationsList, targetRelation] // Update target relationships
    );

    setIsDialogOpen(false);
    setSearchTerm("");
  };
  const handleRemoveRelation = (type, relatedTaskId) => {
    // Find the relationship IDs to remove
    const sourceRel = relationsList.find(
      (rel) => rel.target_task_id === relatedTaskId
    );
    const targetRel = targetRelationsList.find(
      (rel) => rel.source_task_id === relatedTaskId
    );

    // Store the IDs of relationships to be removed
    if (sourceRel?.id || targetRel?.id) {
      setRemovedRelationships((prev) => [
        ...prev,
        ...(sourceRel?.id ? [sourceRel.id] : []),
        ...(targetRel?.id ? [targetRel.id] : []),
      ]);
    }
    // Update UI
    const updatedSourceRelations = relationsList.filter(
      (rel) => rel.target_task_id !== relatedTaskId
    );

    const updatedTargetRelations = targetRelationsList.filter(
      (rel) => rel.source_task_id !== relatedTaskId
    );

    onChange(updatedSourceRelations, updatedTargetRelations);
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

          // Create tooltip content based on relationship type
          const tooltipContent =
            type === "none"
              ? `Linked with ${task.name}`
              : type === "blocker"
              ? `This task is Blocking: ${task.name}`
              : `This task is Waiting on: ${task.name}`;

          return (
            <TooltipProvider key={relatedTaskId}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={`flex items-center justify-between px-3 py-2 rounded-lg w-fit gap-2 group transition-colors ${
                      type === "none"
                        ? "bg-[#f4f4f5] hover:bg-[#e4e4e7]"
                        : type === "blocker"
                        ? "bg-[#fee2e2] hover:bg-[#fecaca]"
                        : "bg-[#fef9c3] hover:bg-[#fef08a]"
                    }`}
                  >
                    <span
                      className="text-sm cursor-pointer text-zinc-700 hover:text-zinc-900"
                      onClick={() =>
                        navigate(`/project-board/card/${task.id}`, {
                          state: {
                            GOTO_URLS: `/project-board/card/${taskId}/`,
                          },
                        })
                      }
                    >
                      {task.name || "Task Title (N/A)"}
                    </span>
                    {editMode && (
                      <MdClose
                        className="w-4 h-4 cursor-pointer text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity hover:text-zinc-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveRelation(type, relatedTaskId);
                        }}
                      />
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  className="bg-zinc-900 text-white p-2 rounded-md text-xs"
                  side="top"
                >
                  <div className="flex flex-col gap-1">
                    <div>{tooltipContent}</div>
                    {task.start_date && (
                      <div className="text-zinc-300">
                        Start: {moment(task.start_date).format("MMM DD, YYYY")}
                      </div>
                    )}
                    {task.end_date && (
                      <div className="text-zinc-300">
                        Due: {moment(task.end_date).format("MMM DD, YYYY")}
                      </div>
                    )}
                    {task.status && (
                      <div className="text-zinc-300">Status: {task.status}</div>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
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
              placeholder="Search by task name or ID"
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
