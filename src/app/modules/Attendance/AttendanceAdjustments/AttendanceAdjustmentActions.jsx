import React, { useState } from "react";
import { AttendanceAdjustmentDetails ,AttendanceAdjustmentLogsDetails} from "app/modules/Attendance";
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
    if (isHistoryView) setViewHistoryDetails(true);
    else setView(true);
  };

  return (
    <>
      <DropdownActionMenu
        onView={handleView}
        viewText={`View Attendance Adjustment ${
          isHistoryView ? "History" : ""
        }`}
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
      {ViewHistoryDetails && (
        <AttendanceAdjustmentLogsDetails
          isOpen={ViewHistoryDetails}
          setIsOpen={() => {
            setViewHistoryDetails(false);
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
