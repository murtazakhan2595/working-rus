import React, { useState } from "react";
import { ViewEmployeeLeaveCount } from "app/modules/LeaveTracker";
import DropdownActionMenu from "components/DropdownActionMenu";
import { useNavigate } from "react-router-dom";
import { HasAccess } from "utils/PermissionUtils";

const LeaveCountAction = ({ data, DataList = [] }) => {
  const [view, setView] = useState(null);
  const handleView = () => {
    setView(true);
  };

  return (
    <>
      <DropdownActionMenu
        onView={handleView}
        viewText={`View Leave Count`}
        menuTooltip={`Leave Count Actions`}
      />

      {view && (
        <ViewEmployeeLeaveCount
          isOpen={view}
          setIsOpen={() => {
            setView(false);
          }}
          DataList={DataList}
          currentId={data?.id}
        />
      )}
    </>
  );
};

export default LeaveCountAction;
