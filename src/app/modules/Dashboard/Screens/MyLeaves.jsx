import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CardSubtitle,
} from "components/ui/card";
import { Button } from "components/ui/button";
import { HasAccess } from "utils/PermissionUtils";
import { AppliedLeaves, AllocatedLeavesInfo,LeaveRequest } from "app/modules/LeaveTracker";

const MyLeaves = () => {
  const canAddLeaveRequest = HasAccess("ADD_LEAVE_REQUEST");
  const canViewLeavesApplied = HasAccess("VIEW_LEAVES_APPLIED");
   const [reloadData, setReloadData] = useState(false);
  
  const [showLeaveBalance, setShowLeaveBalance] = useState(true);

  return (
    <>
      <CardHeader className="items-start pb-0">
        <CardTitle className="flex flex-row justify-between w-full">
          <div className="text-base font-semibold text-plum-1100 xl:text-2xl lg:text-xl md:text-lg">
            My Leaves
          </div>
          <div className="flex items-center gap-3">
            {canAddLeaveRequest && (
              <LeaveRequest
                reloadData={() => {
                  setReloadData(!reloadData);
                }}
              />
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Leave Balance Section with Toggle */}
        <div className="p-4 my-4 bg-white border rounded-lg border-zinc-200">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-semibold text-neutral-1000">
              Leave Balance
            </h3>
            <Button
              variant="ghost"
              size="sm"
              className="text-neutral-600 hover:text-neutral-800"
              onClick={() => setShowLeaveBalance(!showLeaveBalance)}
            >
              {showLeaveBalance ? "Hide Details" : "View Details"}
            </Button>
          </div>

          {showLeaveBalance && (
            <div className="space-y-3">
              <AllocatedLeavesInfo />
            </div>
          )}
        </div>
        {canViewLeavesApplied && <AppliedLeaves isDashboard={true} reload={reloadData}/>}
      </CardContent>
    </>
  );
};


export default MyLeaves
