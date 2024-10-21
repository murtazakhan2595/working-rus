import { useState } from "react";
import SheetComponent from "../../../../components/ui/SheetComponent";
import EmployeeDataInfo from "app/modules/payroll/Sections/EmployeeDataInfo";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { X } from "lucide-react";


  const leaveTypes = [
    { name: "Annual", used: 6, total: 10 },
    { name: "Sick", used: 8, total: 10 },
    { name: "Emergency", used: 5, total: 14 },
    { name: "Casual", used: 5, total: 6 },
    { name: "Compensatory", used: 7, total: 12 },
    { name: "Maternity", used: 6, total: 12 },
    { name: "Bereavement", used: 9, total: 12 },
    { name: "Special", used: 2, total: 12 },
  ];

const EmployeeLeavesDetailSheet = ({ employeeLeaves, isOpen, setIsOpen }) => {
  const [isEdit, setIsEdit] = useState(false);

  const formSheetData = {
    triggerText: null,
    title: "Leave Details",

    description: null,
    footer: null,
  };
  const handleClose = () => {
    setIsOpen(false); // Close the sheet
    setIsEdit(false); // Reset to default view mode
  };

  
  return (
    <div>
      <SheetComponent
        {...formSheetData}
        contentClassName="custom-sheet-width"
        isOpen={isOpen}
        setIsOpen={handleClose}
        width="500px"
      >
        {isEdit ? (
          <EditDetails employeeLeaves={employeeLeaves} />
        ) : (
          <ViewDetails
            employeeLeaves={employeeLeaves}
            setIsEdit={setIsEdit}
            handleClose={handleClose}
          />
        )}
      </SheetComponent>
    </div>
  );
};

const ViewDetails = ({ employeeLeaves, setIsEdit }) => {
    function LeaveBar({
      used,
      total,
      usedColor = "#AB4ABA",
      totalColor = "#F0F0F3",
    }) {
      const usedWidth = Math.min((used / total) * 100, 100);

      return (
        <div className="relative w-full h-4 rounded-xl overflow-hidden">
          {/* Total bar */}
          <div
            className="absolute top-0 left-0 h-full w-full"
            style={{ backgroundColor: totalColor }}
          />
          {/* Used bar */}
          <div
            className="absolute top-0 left-0 h-full"
            style={{ width: `${usedWidth}%`, backgroundColor: usedColor }}
          />
        </div>
      );
    }
  return (
    <>
      <div className="flex items-center justify-between">
        <EmployeeDataInfo
          name={employeeLeaves.full_name}
          email={employeeLeaves.work_email}
          id={employeeLeaves.id}
        />
        <Button className="bg-white border border-[#e8e8ec]" onClick={()=>{setIsEdit(true)}}>
          <div className="text-center text-[#1c2024] text-xs font-semibold">
            Edit Leaves
          </div>
        </Button>
      </div>
      <div className="flex flex-col bg-white rounded-lg shadow border border-zinc-200 p-6 mt-8">
        <h3 className="text-sm font-semibold text-neutral-800 mb-4">
          Consumed Leaves
        </h3>
        <div className="flex relative gap-4 items-start">
          <div className="flex flex-col justify-center text-sm leading-tight whitespace-nowrap text-neutral-400">
            {leaveTypes.map((leave) => (
              <div key={leave.name} className="mt-4 first:mt-0">
                {leave.name}
              </div>
            ))}
          </div>
          <div className="flex flex-col flex-1 justify-between self-stretch min-w-[240px]">
            {leaveTypes.map((leave) => (
              <LeaveBar
                key={leave.name}
                used={leave.used}
                total={leave.total}
              />
            ))}
          </div>
          <div className="flex flex-col justify-center text-sm font-medium leading-tight text-neutral-400">
            {leaveTypes.map((leave) => (
              <div key={leave.name} className="mt-4 first:mt-0">
                <span className="text-neutral-800">{leave.used}</span>/
                {leave.total}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

const EditDetails = ({ employeeLeaves, handleClose }) => {
  const [number, setNumber] = useState(12);

  const initialLeaveTypes = {
    Annual: 12,
    Sick: 12,
    Emergency: 12,
    Casual: 12,
    Compensatory: 12,
    Bereavement: 12,
    Special: 12,
  };

  const [leaveDays, setLeaveDays] = useState(initialLeaveTypes);

  // Function to handle changes in the number input
  const handleLeaveChange = (leaveName, newValue) => {
    setLeaveDays((prevLeaveDays) => ({
      ...prevLeaveDays,
      [leaveName]: newValue, // Update only the specific leave type
    }));
  };
  return (
    <>
      <EmployeeDataInfo
        name={employeeLeaves.full_name}
        email={employeeLeaves.work_email}
        id={employeeLeaves.id}
      />
      <div className="flex flex-col bg-white rounded-lg shadow border border-zinc-200 p-6 mt-8">
        <h3 className="text-sm font-semibold text-neutral-800 mb-4">
          Leave Types
        </h3>
        {Object.keys(leaveDays).map((leaveName) => (
          <div
            className="flex justify-between items-start mb-4"
            key={leaveName}
          >
            <div className="text-zinc-500 text-sm">{leaveName}</div>
            <div className="flex items-center gap-4">
              <Input
                type="number"
                value={leaveDays[leaveName]}
                onChange={(e) => handleLeaveChange(leaveName, e.target.value)}
                className="overflow-hidden self-stretch my-auto rounded-sm w-fit max-w-[80px] py-[6px]"
                aria-label={`Number input for ${leaveName}`}
              />
              <X size={20} />
            </div>
          </div>
        ))}
        <div className="flex flex-col justify-end gap-4 md:flex-row lg:flex-row xl:flex-row pt-6">
          <Button
            variant="outline"
            size="lg"
            onClick={handleClose}
            type="button"
          >
            Cancel
          </Button>
          <Button
            size="lg"
            variant="default"
            onClick={handleClose}
            type="button"
          >
            Save
          </Button>
        </div>
      </div>
    </>
  );
};

export default EmployeeLeavesDetailSheet;
