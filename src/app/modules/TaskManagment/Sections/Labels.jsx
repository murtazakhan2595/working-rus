import React, { useState, useEffect, useMemo } from "react";
import { Plus, Search } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "src/@/components/ui/popover";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { Label } from "src/@/components/ui/label";
import { Checkbox } from "src/@/components/ui/checkbox";
import { Card } from "components/ui/card";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { getDarkerTextColor } from "app/modules/TaskManagment/Boards/Sections/getTaskStatus";
import { getAllLabels } from "app/hooks/taskManagment";
import { TaskDetailBox } from "app/modules/TaskManagment/Sections";
import { fetchTaskLabels } from "state/slices/TaskManagmentSlice";
import { getDropdownList, getLabelDropdownList } from "utils/Lists";
import { SelectMultiInputComponent } from "components/FormControl";
import { Calendar, Flag } from "lucide-react";

const headers = () => ({
  Authorization: `Bearer ${window.localStorage.getItem("token")}`,
  "Content-Type": "application/json",
});

const Labels = React.memo(
  ({ labelsSelected, onSelectedLabelsChange = () => {}, editMode = true }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [showNewLabel, setShowNewLabel] = useState(false);
    const [newLabelTitle, setNewLabelTitle] = useState("");
    const [selectedColor, setSelectedColor] = useState("bg-purple-300");
    const baseUrl = useSelector((state) => state.user.baseUrl);
    const labelsList = useSelector((state) => state.task_managment.task_labels);
    const dispatch = useDispatch();
    const TaskLabelListOptions = getLabelDropdownList(labelsList);

    const filteredLabels = useMemo(() => {
      return labelsList?.filter((label) =>
        label.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }, [searchQuery, labelsList]);

    const handleLabelToggle = (labelId) => {
      if (labelsSelected.includes(labelId)) {
        const updatedLabels = labelsSelected.filter((id) => id !== labelId);
        onSelectedLabelsChange(updatedLabels);
        return updatedLabels;
      } else {
        const updatedLabels = [...labelsSelected, labelId];
        onSelectedLabelsChange(updatedLabels);
        return updatedLabels;
      }
    };

    const handleSaveNewLabel = async () => {
      try {
        const formData = new FormData();
        formData.append("name", newLabelTitle);
        formData.append("color", selectedColor);

        const response = await axios.post(`${baseUrl}/TaskLabel`, formData, {
          headers: headers(),
        });

        if (response.status === 201) {
          dispatch(fetchTaskLabels());
          toast.success("Label Added!", {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      } catch (error) {
        console.error("Error saving label:", error);
      } finally {
        setShowNewLabel(false);
        setNewLabelTitle("");
        setSelectedColor("bg-purple-300");
      }
    };

    const handleSearchChange = (e) => {
      setSearchQuery(e.target.value);
    };

    return editMode ? (
      <SelectMultiInputComponent
        name="label"
        options={TaskLabelListOptions}
        label={"Label"}
        value={labelsSelected || []}
        valueIdentifier={false}
        onChange={(field, value) => {
          onSelectedLabelsChange(value);
        }}
        addNewOption={true}
        NewOptionButtonDetail={{
          buttonValue: "Add New Label",
          onClick: () => {},
        }}
      />
    ) : (
      labelsSelected && labelsSelected.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {labelsSelected?.map((labelId) => {
            const label = labelsList?.find((label) => label.id === labelId);
            return (
              <li
                key={labelId}
                className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  label?.color
                } ${getDarkerTextColor(label?.color)}`}
              >
                {label?.name}
              </li>
            );
          })}
        </ul>
      )
    );
  }
);

export default Labels;
