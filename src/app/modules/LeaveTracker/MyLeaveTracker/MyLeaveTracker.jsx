import { Button } from "components/ui/button";
import React, { useEffect, useState } from "react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "components/ui/card";
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
import { Header, UnauthorizedAccess } from "components";
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
        {/* Consumed Leaves Section - Only show if user can view consumed leaves */}
        {canViewConsumedLeaves && (
          <Card className="w-full overflow-hidden">
            <CardHeader>
              <CardTitle className="text-primary">Consumed Leaves</CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>
            <CardContent>
              <AllocatedLeavesInfo />
            </CardContent>
          </Card>
        )}
        {/* Applied Leaves Section - Only show if user can view applied leaves */}

        <Card className="w-full">
          <CardHeader className="">
            <CardTitle className="text-primary">Applied Leaves</CardTitle>
            <CardDescription>
              Here you view all teh leave applied.
            </CardDescription>
          </CardHeader>
          <CardContent className="scrollable table-container">
            {canViewLeavesApplied ? (
              <AppliedLeaves reload={reloadData} />
            ) : (
              <UnauthorizedAccess
                title="Leave Access Denied"
                featureName="leave features"
                message="You don't have permission to view leaves applied. Please contact your administrator to request access."
                showButtons={true}
                size="sm"
              />
            )}
          </CardContent>
        </Card>

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
