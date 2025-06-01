import React, { useState } from "react";
import AlertDialogue from "components/ui/AlertDialogue";
import { ViewUserRole } from "app/modules/RoleAndPermissions/UserRole";
import { TimeAdjustmentHistoryDetails } from "app/modules/Attendance";
import DropdownActionMenu from "components/DropdownActionMenu";
import { deleteRecord } from "app/hooks/general";
import { useNavigate } from "react-router-dom";
import { HasAccess } from "utils/PermissionUtils";

const TimeAdjustmentsActions = ({
  data,
  isHistoryView = false,
  reloadData = () => {},
  TimeAdjustmentList = [],
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
        viewText={`View Time Adjustment ${isHistoryView ? "History" : ""}`}
        menuTooltip={`Time Adjustment  ${
          isHistoryView ? "History" : ""
        } Actions`}
      />

      {view?.visible && (
        <ViewUserRole
          isOpen={view.visible}
          setIsOpen={(isOpen) =>
            setView((prev) => ({ ...prev, visible: isOpen }))
          }
          data={view.data}
          reload={reloadData}
          UserRoleList={TimeAdjustmentList}
          roleID={view?.data?.id}
        />
      )}
    </>
  );
};

export default TimeAdjustmentsActions;
