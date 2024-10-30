import { useState, useEffect } from "react";
import { Pencil, X } from "lucide-react";
import { Checkbox } from "../../../../src/@/components/ui/checkbox";
import { Button } from "components/ui/button";
import axios from "axios";
import { useSelector } from "react-redux";

const headers = () => ({
  Authorization: `Bearer ${window.localStorage.getItem("token")}`,
  "Content-Type": "application/json",
});

export default function CheckList({ items, setItems }) {
  const baseUrl = useSelector((state) => state.user.baseUrl);

  const handleEdit = (id) => {
    const item = items.find((item) => item.id === id);
    if (item) {
      setItems(
        items.map((el) => (el.id === id ? { ...el, isEditing: true } : el))
      );
    }
  };

  const handleRemove = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleCheck = (id, checked) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, checked } : item
      )
    );
  };

  return (
      <div>
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-2 p-2 rounded-lg hover:bg-muted/50"
          >
            <div className="flex items-center gap-2">
              <Checkbox
                checked={item.checked}
                onCheckedChange={(checked) => handleCheck(item.id, checked)}
              />
              <span className={item.checked ? "line-through text-muted-foreground" : ""}>
                {item.label}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-primary hover:text-primary"
                onClick={() => handleEdit(item.id)}
              >
                <Pencil className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={() => handleRemove(item.id)}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Remove</span>
              </Button>
            </div>
          </div>
        ))}
      </div>
  );
}
