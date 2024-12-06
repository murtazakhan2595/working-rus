import * as React from "react";
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
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getDarkerTextColor } from "../Boards/Sections/getTaskStatus";
import { getAllLabels } from "app/hooks/taskManagment";

const headers = () => ({
  Authorization: `Bearer ${window.localStorage.getItem("token")}`,
  "Content-Type": "application/json",
});

export default function Labels({ onSelectedLabelsChange, labelsList, reloadList,labelsSelected }) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedLabels, setSelectedLabels] = React.useState([]);
  const [showNewLabel, setShowNewLabel] = React.useState(false);
  const [newLabelTitle, setNewLabelTitle] = React.useState("");
  const [selectedColor, setSelectedColor] = React.useState("");
  const baseUrl = useSelector((state) => state.user.baseUrl);

  const colorOptions = [
    "bg-purple-300",
    "bg-purple-500",
    "bg-purple-700",
    "bg-emerald-300",
    "bg-emerald-500",
    "bg-teal-700",
    "bg-gray-400",
    "bg-gray-500",
    "bg-gray-900",
    "bg-pink-500",
    "bg-red-500",
    "bg-red-700",
    "bg-amber-500",
    "bg-amber-700",
    "bg-brown-700",
  ];

  // Filter labels based on search query
  const filteredLabels = React.useMemo(() => {
    return labelsList?.filter((label) =>
      label.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, labelsList]);


  const handleLabelToggle = (labelId) => {
    setSelectedLabels((prev) => {
      const updatedLabels = prev.includes(labelId)
        ? prev.filter((id) => id !== labelId)
        : [...prev, labelId];

      onSelectedLabelsChange(updatedLabels); 
      return updatedLabels;
    });
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
        reloadList();
        toast.success("Label Added!", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (error) {
      console.error("Error saving label:", error);
    } finally {
      setShowNewLabel(false);
      setNewLabelTitle("");
      setSelectedColor("");
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className=" max-w-sm flex" >
       <div style={{maxWidth:'85%'}}>
          <ul className="flex flex-wrap gap-2">
                    {labelsSelected?.map((label) => (
                      <li
                        key={label.id}
                        className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          label?.color
                        } ${getDarkerTextColor(label?.color)}`}
                      >
                        {label?.name}
                      </li>
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
                {filteredLabels?.map((label) => (
                  <div key={label?.id} className="flex items-center space-x-2">
                    <Checkbox
                      checked={selectedLabels.includes(label?.id)}
                      onCheckedChange={() => handleLabelToggle(label?.id)}
                    />
                    <span className={`px-3 py-1 rounded-full ${label?.color} inline-block ${getDarkerTextColor(label?.color)}`}>
                      {label?.name}
                    </span>
                  </div>
                ))}
                {filteredLabels?.length === 0 && (
                  <div className="text-center text-gray-500 py-2">
                    No labels found
                  </div>
                )}
              </div>

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
                          className={`w-full h-12 rounded-lg ${selectedColor}`}
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
                      {colorOptions.map((color, index) => (
                        <button
                          key={index} // Consider using a unique key if available
                          className={`w-12 h-8 rounded-md ${color} ${
                            selectedColor === color
                              ? "ring-2 ring-offset-2 ring-black"
                              : ""
                          }`}
                          onClick={() => setSelectedColor(color)}
                        />
                      ))}
                    </div>

                    <div className="flex justify-between pt-4">
                      <Button
                        variant="outline"
                        onClick={() => setShowNewLabel(false)}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleSaveNewLabel}>Save</Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </Card>
        </PopoverContent>
      </Popover>
    </div>
  );
}
