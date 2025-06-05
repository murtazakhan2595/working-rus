import React, { useState } from "react";
import { ViewLeaveDetails } from "app/modules/LeaveTracker";
import DropdownActionMenu from "components/DropdownActionMenu";
import { useNavigate } from "react-router-dom";
import { HasAccess } from "utils/PermissionUtils";

const LeaveTrackerActions = ({
  data,
  isHistoryView = false,
  reloadData = () => {},
  DataList = [],
}) => {
  const [view, setView] = useState(null);
  const handleView = () => {
    setView(true);
  };

  return (
    <>
      <DropdownActionMenu
        onView={handleView}
        viewText={`View Leave ${isHistoryView ? "History" : ""}`}
        menuTooltip={`Leave ${isHistoryView ? "History" : ""} Actions`}
      />

      {view && (
        <ViewLeaveDetails
          isOpen={view}
          setIsOpen={() => {
            setView(false);
            reloadData(true);
          }}
          reloadData={reloadData}
          DataList={DataList}
          currentId={data?.id}
        />
      )}
    </>
  );
};

export default LeaveTrackerActions;
