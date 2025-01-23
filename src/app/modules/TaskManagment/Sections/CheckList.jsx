import { useState, useEffect } from "react";
import { Pencil, X } from "lucide-react";
import { Plus, Search } from "lucide-react";
import { TaskDetailBox } from "app/modules/TaskManagment/Sections";
import { Checkbox } from "src/@/components/ui/checkbox";
import { Button } from "components/ui/button";
import { calculateTotalCount, calculatePercentage } from "utils/renderValues";
import { Input } from "components/ui/input";
import { deleteTaskCheckListItem } from "app/hooks/taskManagment";
import { DetailBox, DetailCard } from "components/SheetCardExtension";
import { Progress } from "src/@/components/ui/progress"; // Assuming Shadcn provides this

export default function CheckList({ items = [], onChange, editMode = true }) {
  const [newItem, setNewItem] = useState("");

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
    const checkListItem = items[index];
    if (checkListItem.id) {
      try {
        await deleteTaskCheckListItem(checkListItem.id);
      } catch (error) {
        console.error("Error removing checklist item:", error);
      }
    }
    onChange(items.filter((_, i) => i !== index));
  };

  const handleCheck = (index) => {
    onChange(
      items.map((el, i) =>
        i === index ? { ...el, is_completed: !el.is_completed } : el
      )
    );
  };
  const checkCompleted = calculatePercentage(
    calculateTotalCount(items || [], "is_completed", true),
    items.length
  );
  return (
    <DetailCard detailCardTitle="" classNames="mt-0">
      <div className="flex justify-between gap-4 flex-col">
        <div className="flex justify-between gap-3 flex-4 items-center">
          <Progress value={checkCompleted} className="mt-1 h-2 bg-gray-400" />
          <span>{`${checkCompleted}%`}</span>
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Item name"
            value={newItem}
            onChange={(e) => {
              setNewItem(e.target.value);
            }}
            className="rounded"
          />
          <Button
            className="rounded"
            onClick={(e) => {
              e.preventDefault();
              const prevItems = items || [];
              const newItemObj = {
                description: newItem,
                is_completed: false,
              };
              const checkList = [...prevItems, newItemObj];
              onChange(checkList);
              setNewItem(""); // Clear input after adding
            }}
          >
            Add
          </Button>
        </div>
        {items && items.length > 0 && (
          <div className="flex flex-col w-full">
            {items.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-2 p-2 rounded-lg hover:bg-gray-100"
              >
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={item.is_completed}
                    onCheckedChange={() => {
                      if (editMode) handleCheck(index);
                    }}
                    disabled={!editMode}
                  />
                  {item.isEditing ? (
                    <input
                      type="text"
                      defaultValue={item.description}
                      className="border border-gray-300 rounded p-1"
                      onBlur={(e) => handleEditSubmit(index, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleEditSubmit(index, e.target.value);
                        }
                      }}
                    />
                  ) : (
                    <span
                      className={
                        item.is_completed
                          ? "line-through text-muted-foreground"
                          : ""
                      }
                    >
                      {item.description}
                    </span>
                  )}
                </div>
                {editMode && (
                  <div className="flex items-center gap-2">
                    {!item.isEditing && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary hover:text-primary p-0"
                        onClick={() => handleEdit(index)}
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive p-0"
                      onClick={() => handleRemove(index)}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DetailCard>
  );
}
