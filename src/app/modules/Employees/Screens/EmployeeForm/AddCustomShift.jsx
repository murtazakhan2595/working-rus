import React, { useEffect, useState } from "react";
import { Button } from "components/ui/button";
import EmployeeCustomShiftModal from "./EmployeeCustomShiftModal";
import { CalendarDays } from "lucide-react";
import { DateRangeInput } from "components/FormControl";

const AddCustomShift = ({ customShiftData, setCustomShiftData }) => {
  // Calculate probation period whenever date range changes
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsOpen(true);
  };

  return (
    <div className="flex-col flex justify-end h-full">
      <Button onClick={handleClick} className="w-fit">
        {customShiftData ? "Edit" : "Add"} Custom Shift
      </Button>
      {customShiftData && (
        <div className="mt-2 p-3 bg-purple-50 border border-purple-200 rounded-md">
          <div className="text-sm font-medium text-purple-800">
            ✓ Custom Schedule Configured: {customShiftData.scheduleName}
          </div>
          <div className="text-xs text-purple-600 mt-1">
            Weekly Hours: {customShiftData.totalHours?.weekly?.toFixed(1) || 0}{" "}
            hours
          </div>
        
        </div>
      )}
      {isOpen && (
        <EmployeeCustomShiftModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          onShiftDataSave={(shiftData) => {
            setCustomShiftData(shiftData);
            setIsOpen(false);
          }}
          existingShiftData={customShiftData}
        />
      )}
    </div>
  );
};
export default AddCustomShift;
