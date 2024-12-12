import { useState, useEffect } from "react";
import { Pencil, X } from "lucide-react";
import { Plus, Search } from "lucide-react";

import { Checkbox } from "src/@/components/ui/checkbox";
import { Button } from "components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "src/@/components/ui/popover";
import { Input } from "components/ui/input";
import { deleteTaskCheckListItem } from "app/hooks/taskManagment";

export default function CheckList({ items, onChange }) {
  const [newItem, setNewItem] = useState("");

  const handleEdit = (index) => {
    onChange(
      items.map((el, i) =>
        i === index ? { ...el, isEditing: true } : el
      )
    );
  };

  const handleEditSubmit = (index, newDescription) => {
    onChange(
      items.map((el, i) =>
        i === index ? { ...el, description: newDescription, isEditing: false } : el
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
        i === index
          ? { ...el, is_completed: !el.is_completed }
          : el
      )
    );
  };

  return (
    <div className="max-w-sm flex">
      <div style={{ maxWidth: "85%" }}>
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between gap-2 p-2 rounded-lg"
          >
            <div className="flex items-center gap-2">
              <Checkbox
                checked={item.is_completed}
                onCheckedChange={() => handleCheck(index)}
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
            <div className="flex items-center gap-2">
              {!item.isEditing && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary hover:text-primary"
                  onClick={() => handleEdit(index)}
                >
                  <Pencil className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={() => handleRemove(index)}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Remove</span>
              </Button>
            </div>
          </div>
        ))}
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-10 h-10 p-0 rounded-full">
            <Plus className="w-4 h-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="start">
          <div className="flex gap-2">
            <Input
              placeholder="Item name"
              value={newItem}
              onChange={(e) => {
                setNewItem(e.target.value);
              }}
            />
            <Button
              onClick={() => {
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
        </PopoverContent>
      </Popover>
    </div>
  );
}

