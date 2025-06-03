import React, { useState } from "react";
import { AttendanceAdjustmentDetails } from "app/modules/Attendance";
import DropdownActionMenu from "components/DropdownActionMenu";
import { useNavigate } from "react-router-dom";
import { HasAccess } from "utils/PermissionUtils";

const AttendanceAdjustmentActions = ({
  data,
  isHistoryView = false,
  reloadData = () => {},
  DataList = [],
}) => {
  const [view, setView] = useState(null);
  const navigate = useNavigate();
  const [ViewHistoryDetails, setViewHistoryDetails] = useState(null);
  const handleView = () => {
    if (isHistoryView)
      navigate("/time-adjustments/history-details", {
        state: { GOTO_URL: "/time-adjustments/history", id: data.id },
      });
    else setView(true);
  };

  return (
    <>
      <DropdownActionMenu
        onView={handleView}
        viewText={`View Attendance Adjustment ${isHistoryView ? "History" : ""}`}
        menuTooltip={`Attendance Adjustment  ${
          isHistoryView ? "History" : ""
        } Actions`}
      />

      {view && (
        <AttendanceAdjustmentDetails
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

export default AttendanceAdjustmentActions;
