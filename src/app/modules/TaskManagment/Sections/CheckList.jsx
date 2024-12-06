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
import { useSelector } from "react-redux";


export default function CheckList({
  items,
  setItems,
  handleAddItem,
  onChange,
  checkItemValue,
}) {
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
      items.map((item) => (item.id === id ? { ...item, checked } : item))
    );
  };

  return (
    <>
    <div className=" max-w-sm flex" >
    <div style={{maxWidth:'85%'}}>
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
                <span
                  className={
                    item.checked ? "line-through text-muted-foreground" : ""
                  }
                >
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
                value={checkItemValue}
                onChange={(e) => onChange(e.target.value)}
              />
              <Button onClick={handleAddItem}>Add</Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
}
