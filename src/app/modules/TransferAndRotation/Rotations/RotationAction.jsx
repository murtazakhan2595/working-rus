import React, { useState } from "react";
import { JobRotationDetails } from "app/modules/TransferAndRotation";
import DropdownActionMenu from "components/DropdownActionMenu";
import { useNavigate } from "react-router-dom";
import { HasAccess } from "utils/PermissionUtils";

const RotationAction = ({
    data,
    isHistoryView = false,
    reloadData = () => { },
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
                viewText={`View Job Rotation`}
                menuTooltip={`Job Rotation Actions`}
            />

            {view && (
                <JobRotationDetails
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

export default RotationAction;
