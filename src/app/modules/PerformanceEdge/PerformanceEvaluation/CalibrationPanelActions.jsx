import React, { useState } from "react";
import DropdownActionMenu from "components/DropdownActionMenu";
import { AdjustScoreForm, PerformanceCycleDetails } from "app/modules/PerformanceEdge";
import { HasAccess } from "utils/PermissionUtils";

const CalibrationPanelActions = ({ data, reloadData = () => { }, DataList = [] }) => {
    const isAdjustScorePermitted = HasAccess("CALIBRATE_SCORE");
    const [view, setView] = useState(null);
    const [edit, setEdit] = useState(null);
    const [deleteDurationState, setDeleteDurationState] = useState(null);

    // Handle opening the view dialog
    const handleView = () => {
        setView(true);
    };

    const AllowAdjustScore = !data.is_locked;

    if (!AllowAdjustScore || !isAdjustScorePermitted) return null;


    return (
        <>
            <DropdownActionMenu
                onView={handleView}
                viewText="Adjust Score"
                menuTooltip="Calibration Actions"
            />

            {view && (
                <AdjustScoreForm
                    isOpen={view}
                    setIsOpen={setView}
                    final_score={data.final_score}
                    reloadData={reloadData}
                    FinalEvaluationId={data.id}
                />
            )}
        </>
    );
};

export default CalibrationPanelActions;
