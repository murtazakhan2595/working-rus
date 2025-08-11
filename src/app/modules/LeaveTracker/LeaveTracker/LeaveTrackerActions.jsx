import React, { useState } from "react";
import { ViewLeaveDetails } from "app/modules/LeaveTracker";
import DropdownActionMenu from "components/DropdownActionMenu";

const LeaveTrackerActions = ({
  data,
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
        viewText={`View Leave`}
        menuTooltip={`Leave Actions`}
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
