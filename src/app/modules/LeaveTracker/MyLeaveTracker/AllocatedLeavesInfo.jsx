import React, { useState, useEffect, memo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "components/ui/card";
import { Progress } from "src/@/components/ui/progress"; // Assuming Shadcn provides this
import { getEligibleLeaveTypeDurations } from "app/hooks/leaveTracker";

const AllocatedLeavesInfo = () => {
  const [allocatedLeaves, setAllocatedLeave] = useState([]);

  const fetchLeaveAllocated = async (isMounted) => {
    try {
      const response = await getEligibleLeaveTypeDurations({});
      if (isMounted && response) {
        setAllocatedLeave(response || []);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    let isMounted = true;
    fetchLeaveAllocated(isMounted);
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader>
        <CardTitle className="text-primary">Consumed Leaves</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col">
          <div className="flex flex-col gap-4">
            {allocatedLeaves.map((leave) => {
              const consumed_percentage = Math.round(
                (parseInt(leave.consumed_count || 0, 10) /
                  parseInt(leave.allotted_count || 1, 10)) *
                  100
              );

              return (
                <div
                  key={`${leave.id}-${leave.name}`}
                  className="flex flex-col gap-2 w-full lg:w-[50%]"
                >
                  <div className="mt-4 first:mt-0">{leave.name}</div>
                  <div className="flex gap-1">
                    <p className="text-xs text-gray-800">
                      {leave.allotted_count} Allotted • {leave.consumed_count} Consumed •{" "}
                      {leave.balance_count} Balanced • {leave.carry_forward} Carry Forward •{" "}
                      {leave.offset_count} Offset Count
                    </p>
                  </div>
                  <div className="flex flex-row gap-3">
                    <Progress
                      value={consumed_percentage || 0}
                      className="mt-1 h-2 bg-gray-500"
                      color="purple"
                    />
                    <p className="text-xs text-gray-800 min-w-[120px]">
                      {consumed_percentage || "0"}% Used
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default memo(AllocatedLeavesInfo);

