import React, { useState } from "react";
import AlertDialogue from "components/ui/AlertDialogue";
import { TransferDetails } from "app/modules/TransferAndRotation";
import { TimeAdjustmentHistoryDetails } from "app/modules/Attendance";
import DropdownActionMenu from "components/DropdownActionMenu";
import { deleteRecord } from "app/hooks/general";
import { useNavigate } from "react-router-dom";
import { HasAccess } from "utils/PermissionUtils";

const TransferActions = ({
  data,
  reloadData = () => {},
  DataList = [],
}) => {
  const [view, setView] = useState(null);
  const navigate = useNavigate();
  const handleView = () => {
    setView(true);
  };

  return (
    <>
      <DropdownActionMenu
        onView={handleView}
        viewText={`View Transfer`}
        menuTooltip={`Transfer Actions`}
      />

      {view && (
        <TransferDetails
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

export default TransferActions;
