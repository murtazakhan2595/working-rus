import React, { useState } from "react";
import { JobRotationDetails } from "app/modules/TransferAndRotation";
import DropdownActionMenu from "components/DropdownActionMenu";
import { useNavigate } from "react-router-dom";
import { HasAccess } from "utils/PermissionUtils";

const RotationAction = ({
    data,
    RecordView = false,
    reloadData = () => { },
    DataList = [],
}) => {
    const [view, setView] = useState(null);
    const navigate = useNavigate();
    const handleView = () => {
        if (RecordView) navigate('/user-job-rotations');
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
