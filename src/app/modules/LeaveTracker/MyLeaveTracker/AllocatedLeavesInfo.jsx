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
import { TooltipText } from "components";
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
            {allocatedLeaves.map(
              ({
                tooltip_info,
                allotted_count,
                consumed_count,
                name,
                id,
                carry_forward,
                balance_count,
              }) => {
                const consumed_percentage = Math.round(
                  (parseInt(consumed_count || 0, 10) /
                    parseInt(allotted_count || 1, 10)) *
                    100
                );

                return (
                  <div
                    key={`${id}-${name}`}
                    className="flex flex-col gap-2 w-full lg:w-[70%]"
                  >
                    <div className="mt-4 first:mt-0 text-neutral-1000">
                      <TooltipText
                        tooltipTriggerText={name}
                        content={tooltip_info}
                        className={'whitespace-pre-line '}
                      />
                    </div>
                    <div className="flex gap-1">
                      <p className="text-xs text-gray-800">
                        {allotted_count} Allotted • {consumed_count} Consumed •{" "}
                        {balance_count} Balanced • {carry_forward} Carry Forward
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
              }
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default memo(AllocatedLeavesInfo);
