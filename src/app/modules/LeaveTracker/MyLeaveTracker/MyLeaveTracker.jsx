import { Button } from "components/ui/button";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../src/@/components/ui/table";
import { LeaveRequest } from "app/modules/LeaveTracker";
import { getLeaves } from "app/hooks/leaveTracker";
import { connect } from "react-redux";
import moment from "moment";
import ViewLeaveSheet from "../LeaveTracker/ViewLeaveDetails";
import { FilterInput } from "components/FormControl";
import { getLeavestats } from "app/hooks/leaveTracker";
import { getLeaveTransaction } from "app/hooks/leaveTracker";
import { AppliedLeaves, AllocatedLeavesInfo } from "app/modules/LeaveTracker";
import { getLeaveComponentsWithUsed } from "app/hooks/leaveTracker";
import { Header } from "components";
import { LeaveTrackerOptions } from "data/Data";
import { HasAccess } from "utils/PermissionUtils";

const MyLeaveTracker = ({ userProfile }) => {
  // Permission checks for leave features
  const canAddLeaveRequest = HasAccess("ADD_LEAVE_REQUEST");
  const canViewLeavesApplied = HasAccess("VIEW_LEAVES_APPLIED");
  const canDeleteLeaveRequest = HasAccess("DELETE_LEAVE_REQUEST");
  const canViewConsumedLeaves = HasAccess("VIEW_CONSUMED_LEAVES");
  const [selectedLeaveApplication, setSelectedLeaveApplication] =
    useState(null);
  const [isOpen, setIsOpen] = useState(true);
  const [reloadData, setReloadData] = useState(false);

  return (
    <>
      <div className="flex flex-col gap-4">
        <Header
          content={
            canAddLeaveRequest && (
              <LeaveRequest
                reloadData={() => {
                  setReloadData(!reloadData);
                }}
              />
            )
          }
        />

        {/* Leave Statistics - Only show if user can view applied leaves
        {canViewLeavesApplied && (
          <div className="p-6">
            <section className="flex flex-wrap gap-4 items-center">
              {LeaveTrackerStats.map((item, index) => (
                <React.Fragment key={item.title}>
                  <div className="flex-1 shrink min-w-[240px]">
                    <div className="pb-2">
                      <h2 className="text-sm font-medium tracking-tight leading-none text-neutral-800">
                        {item.title}
                      </h2>
                    </div>
                    <div>
                      <p className="text-2xl font-bold leading-tight text-fuchsia-700">
                        {item.value}
                      </p>
                    </div>
                  </div>
                  {index < LeaveTrackerStats.length - 1 && (
                    <div className="relative">
                      <div className="w-[70px] h-[1px]  rotate-90 border border-[#deade2] absolute top-0 right-[55px]"></div>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </section>
          </div>
        )} */}

        {/* Consumed Leaves Section - Only show if user can view consumed leaves */}
        {canViewConsumedLeaves && <AllocatedLeavesInfo />}
        {/* Applied Leaves Section - Only show if user can view applied leaves */}
        {canViewLeavesApplied && <AppliedLeaves reload={reloadData}/>}
        {selectedLeaveApplication && (
          <ViewLeaveSheet
            leaveApplication={selectedLeaveApplication}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            isMyLeave={true}
            canDelete={canDeleteLeaveRequest}
            onClose={() => {
              setSelectedLeaveApplication(null);
              setIsOpen(false);
            }}
          />
        )}
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    userProfile: state.user.userProfile,
  };
};

export default connect(mapStateToProps)(MyLeaveTracker);
