import React, { useState } from "react";
import { ViewLeaveDetails ,CancelLeaveRequest} from "app/modules/LeaveTracker";
import DropdownActionMenu from "components/DropdownActionMenu";
import { useNavigate } from "react-router-dom";
import { HasAccess } from "utils/PermissionUtils";

const MyLeavesAction = ({
  data,
  reloadData = () => {},
  DataList = [],
}) => {
  const [view, setView] = useState(null);
  const [openCancelLeave, setOpenCancelLeave] = useState(null);
  const handleView = () => {
    setView(true);
  };
  const handleCancelRequest = () => {
    setOpenCancelLeave(true)
  };

  return (
    <>
      <DropdownActionMenu
        onView={handleView}
        viewText={`View Leave`}
        menuTooltip={`Leave Actions`}
        additionalOptionsConfig={[
          { text: "Cancel Leave", action: handleCancelRequest },
        ]}
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
      {openCancelLeave && (
        <CancelLeaveRequest
          isOpen={openCancelLeave}
          setIsOpen={setOpenCancelLeave}
          reloadData={reloadData}
          id={data?.id}
        />
      )}
    </>
  );
};

export default MyLeavesAction;
