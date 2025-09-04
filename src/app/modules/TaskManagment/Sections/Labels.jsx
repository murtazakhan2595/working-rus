import React, { useState, useEffect, useMemo } from "react";
import { Plus, Trash, Edit } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "src/@/components/ui/popover";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { Label } from "src/@/components/ui/label";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  addTaskLabel,
  deleteTaskLabel,
  getTaskLabelById,
} from "app/hooks/taskManagment";
import { fetchTaskLabels } from "state/slices/TaskManagmentSlice";
import { getLabelDropdownList } from "utils/Lists";
import { lightenColor } from "utils/renderValues";
import { SelectMultiInputComponent } from "components/FormControl";
import { Badge } from "components/ui/badge";

export const TaskLabelBadge = React.memo(({ label }) => {
  if (!label) return null;
  return (
    <Badge
      key={label.id}
      style={{
        background: lightenColor(label?.color, 85),
        color: label.color,
      }}
    >
      {label?.name}
    </Badge>
  );
});

export const AddNewLabel = React.memo(
  ({ showNewLabel = false, setShowNewLabel = () => { }, labelId = null, ProjectId, onResetLabelId }) => {
    const dispatch = useDispatch();
    const [selectedColor, setSelectedColor] = useState("#1B1B1B");
    const [newLabelTitle, setNewLabelTitle] = useState("");
    const colorTextMapping = [
      "#641e16",
      "#17202a",
      "#7b7d7d",
      "#7d6608",
      "#186a3b",
      "#2874a6",
      "#6c3483",
      "#e74c3c",
      "#CC6633",
      "#FFCC00",
      "#669900",
      "#00acc1",
      "#5c6bc0",
      "#ff9800",
      "#12B76A",
    ];
    const fetchTaskLabelData = async (isMounted) => {
      try {
        const labelDetails = await getTaskLabelById(labelId);
        if (!labelDetails) {
          throw new Error("Label details not found.");
        }
        if (isMounted) {
          setSelectedColor(labelDetails.color);
          setNewLabelTitle(labelDetails.name);
        }
      } catch (error) {
        console.error("Error fetching task data:", error);
      }
    };

    useEffect(() => {
      let isMounted = true;
      if (labelId) fetchTaskLabelData(isMounted);
       
      return () => {
        isMounted = false;
      };
    }, [labelId]);

    const handleSaveNewLabel = async (e) => {
      try {
        const response = await addTaskLabel(
          {
            name: newLabelTitle,
            color: selectedColor,
            project_id: ProjectId,
            id: labelId,
          },
          labelId
        );

        if (response) {
          await dispatch(fetchTaskLabels(ProjectId));
          toast.success("Label Added!", {
            position: toast.POSITION.TOP_RIGHT,
          });
        }

      } catch (error) {
        console.error("Error saving label:", error);
      } finally {
        setNewLabelTitle("")
        setShowNewLabel(false);
      }
    };

    return (
      <Popover open={showNewLabel} onOpenChange={setShowNewLabel}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-start">
            <Plus className="w-4 h-4 mr-2" />
            New label
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="start">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Label</h3>
            <div className="space-y-2">
              <Label>Badge</Label>
              {selectedColor && (
                <div
                  className={`w-full h-12 rounded-lg`}
                  style={{ background: selectedColor }}
                />
              )}
            </div>

            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                placeholder="Label"
                value={newLabelTitle}
                onChange={(e) => setNewLabelTitle(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-5 gap-2">
              {colorTextMapping.map((color, index) => (
                <button
                  key={index} // Consider using a unique key if available
                  className={`w-12 h-8 rounded-md ${selectedColor === color
                      ? "ring-2 ring-offset-2 ring-black"
                      : ""
                    }`}
                  style={{ background: color }}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setShowNewLabel(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveNewLabel}>Save</Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    );
  }
);

const Labels = React.memo(
  ({
    labelsSelected = [],
    onSelectedLabelsChange = () => { },
    editMode = true,
    projectId
  }) => {
    const dispatch = useDispatch();
    const [showNewLabel, setShowNewLabel] = useState(false);
    const [persistedProjectId, setPersistedProjectId] = useState(null);

    const [LabelID, setLabelID] = useState(null);
    const labelsList = useSelector((state) => state.task_managment.task_labels);
    const TaskLabelListOptions = getLabelDropdownList(labelsList);
    useEffect(() => {
      if (projectId) {
        setPersistedProjectId(projectId)
        dispatch(fetchTaskLabels(projectId));
      }
    }, [projectId, dispatch])

    const handleDeleteLabel = async (labelId) => {
      const response = await deleteTaskLabel(labelId);
      try {
        if (response) {
          dispatch(fetchTaskLabels(projectId));
          toast.success("Label Deleted!", {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      } catch (error) {
        console.error("Error saving label:", error);
      }
    };

    return (
      <>
        {editMode ? (
          <SelectMultiInputComponent
            name="label"
            options={TaskLabelListOptions}
            label={"Label"}
            value={labelsSelected || []}
            useValueAsIdentifier={false}
            onChange={(field, value) => {
              onSelectedLabelsChange(value);
            }}
            allowNewOption={true}
            newOptionConfig={{
              buttonValue: "Add New Label",
              onClick: () => {
                setLabelID(null)
                setShowNewLabel(true);
              },
            }}
            showOptionsActions={true}
            optionsActions={[
              {
                content: <Edit />,
                onClick: (labelId) => {
                  setLabelID(labelId);
                  setShowNewLabel(true);
                },
              },
              {
                content: <Trash />,
                onClick: (labelId) => {
                  handleDeleteLabel(labelId);
                },
              },
            ]}
          />
        ) : (
          labelsSelected &&
          labelsSelected.length > 0 && (
            <div className="flex flex-wrap gap-2 flex-row">
              {labelsSelected?.map((labelId) => {
                const label = labelsList?.find((label) => label.id === labelId);
                return <TaskLabelBadge label={label} />;
              })}
            </div>
          )
        )}
        {showNewLabel && (
          <AddNewLabel
          ProjectId={persistedProjectId} 
            showNewLabel={showNewLabel}
            setShowNewLabel={setShowNewLabel}
            labelId={LabelID}
            onResetLabelId={() => setLabelID(null)}  
          />
        )}
      </>
    );
  }
);

export default Labels;
