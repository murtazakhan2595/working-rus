import { useEffect, useState } from "react";
import SheetComponent from "../../../../components/ui/SheetComponent";
import EmployeeDataInfo from "app/modules/payroll/Sections/EmployeeDataInfo";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { X } from "lucide-react";
import AddTypeSheet from "./AddTypeSheet";
import { getLeaveComponentsWithUsed } from "app/hooks/leaveTracker";
import { getLeaveComponents } from "app/hooks/leaveTracker";
import { connect, useSelector } from "react-redux";

const EmployeeLeavesDetailSheet = ({
  employeeLeaves,
  isOpen,
  setIsOpen,
  userProfile,
}) => {
  const [isEdit, setIsEdit] = useState(false);
  const [componentsWithUsed, setComponentsWithUsed] = useState([]);
  const [leaveComponents, setLeaveComponents] = useState([]);
  console.log("employeeLeaves", employeeLeaves);

  const fetchData = async () => {
    const componentsWithUsed = await getLeaveComponentsWithUsed(
      employeeLeaves.id
    );
    if (componentsWithUsed) {
      setComponentsWithUsed(componentsWithUsed);
    }
    const leaveComponents = await getLeaveComponents({
      filterData: {
        employee_id_and_org: `${employeeLeaves.id},${true}`,
      },
    });
    if (leaveComponents) {
      setLeaveComponents(leaveComponents?.results);
    }
  };
  useEffect(() => {
    fetchData();
  }, [employeeLeaves.id]);

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
        width="568px"
       
      >
        {isEdit ? (
          <EditDetails
            employeeLeaves={employeeLeaves}
            handleClose={handleClose}
            leaveComponents={leaveComponents}
            fetchData={fetchData}
          />
        ) : (
          <ViewDetails
            employeeLeaves={employeeLeaves}
            setIsEdit={setIsEdit}
            componentsWithUsed={componentsWithUsed}
            userProfile={userProfile}
          />
        )}
      </SheetComponent>
    </div>
  );
};

const ViewDetails = ({
  employeeLeaves,
  setIsEdit,
  componentsWithUsed,
  userProfile,
}) => {
  function LeaveBar({
    used,
    total,
    usedColor = "#AB4ABA",
    totalColor = "#F0F0F3",
  }) {
    const usedWidth = Math.min((used / total) * 100, 100);

    return (
      <div className="relative w-full h-4 overflow-hidden rounded-xl">
        {/* Total bar */}
        <div
          className="absolute top-0 left-0 w-full h-full"
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
          name={employeeLeaves.first_name + " " + employeeLeaves.last_name}
          email={employeeLeaves.work_email}
          id={employeeLeaves.id}
          src={employeeLeaves.profile_picture?.file}
        />
        {userProfile.role !== 2 && (
          <Button
          variant="outline"
            onClick={() => {
              setIsEdit(true);
            }}
          >
              Edit Leaves
          </Button>
        )}
      </div>
      <div className="flex flex-col p-6 mt-8 bg-white border rounded-lg shadow border-zinc-200">
        <h3 className="mb-4 text-sm font-semibold text-neutral-800">
          Consumed Leaves
        </h3>
        <div className="relative flex items-start gap-4">
          <div className="flex flex-col justify-center text-sm leading-tight whitespace-nowrap text-neutral-900">
            {componentsWithUsed.map((leave) => (
              <div
                key={leave.name}
                className="mt-4 first:mt-0 max-w-[6.25rem] truncate"
              >
                {leave.name}
              </div>
            ))}
          </div>
          <div className="flex flex-col flex-1 justify-between self-stretch min-w-[240px]">
            {componentsWithUsed.map((leave) => (
              <LeaveBar
                key={leave.name}
                used={leave.used}
                total={leave.total}
              />
            ))}
          </div>
          <div className="flex flex-col justify-center text-sm font-medium leading-tight text-neutral-900">
            {componentsWithUsed.map((leave) => (
              <div key={leave.name} className="mt-4 first:mt-0">
                <span className="text-neutral-900">{leave.used}</span>/
                {leave.total}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

const EditDetails = ({
  employeeLeaves,
  handleClose,
  leaveComponents,
  fetchData,
}) => {
  const [openSheet, setOpenSheet] = useState(false);
  const [selectedLeaveComponent, setSelectedLeaveComponent] = useState(null);

  return (
    <>
      <EmployeeDataInfo
        name={employeeLeaves.first_name + " " + employeeLeaves.last_name}
        email={employeeLeaves.work_email}
        id={employeeLeaves.id}
        src={employeeLeaves.profile_picture?.file}
      />
      <div className="flex flex-col p-6 mt-8 bg-white border rounded-lg shadow border-zinc-200">
        <h3 className="mb-4 text-sm font-semibold text-neutral-800">
          Leave Types
        </h3>
        {leaveComponents.map((leave) => (
          <div
            className="flex items-center justify-between mb-4"
            key={leave.id}
          >
            <div className="text-sm text-zinc-500">{leave.name}</div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold">
                {leave.max_days} days
              </span>
              {!leave.Is_org_based ? (
                <Button
                  variant="outline"
                  type="button"
                  className="w-fit"
                  onClick={() => {
                    setSelectedLeaveComponent(leave);
                  }}
                >
                  Details
                </Button>
              ) : (
                <div className="min-w-[79.58px]"></div>
              )}
            </div>
          </div>
        ))}
        <Button
          variant="outline"
          type="button"
          className="w-fit"
          onClick={() => {
            setOpenSheet(true);
          }}
        >
          + Add Another Leave Type
        </Button>
      </div>
      <AddTypeSheet
        openSheet={openSheet}
        isEmployeeBased={true}
        employeeId={employeeLeaves.id}
        reload={fetchData}
        setOpenSheet={setOpenSheet}
      />
      {selectedLeaveComponent && (
        <AddTypeSheet type={selectedLeaveComponent} reload={fetchData} />
      )}
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    userProfile: state.user.userProfile,
    departments: state.common.departments,
  };
};

export default connect(mapStateToProps)(EmployeeLeavesDetailSheet);
