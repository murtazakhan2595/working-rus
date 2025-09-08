import React, { useState } from "react";
import SheetComponent from "components/ui/SheetComponent";
import DropdownActionMenu from "components/DropdownActionMenu";
import AlertDialogue from "components/ui/AlertDialogue";
import { EvaluationResultDetails } from "app/modules/PerformanceEdge";
import { toast } from "react-toastify";
import { deleteRecord } from "app/hooks/general";

const EvaluationResultsActions = ({ data, reloadData = () => { }, DataList = [] }) => {
    const [view, setView] = useState(null);
    const [edit, setEdit] = useState(null);
    const [deleteDurationState, setDeleteDurationState] = useState(null);

    // Handle opening the view dialog
    const handleView = () => {
        setView(true);
    };

 



    return (
        <>
            <DropdownActionMenu
                onView={handleView}
                viewText={'View Evaluation Results'}
                menuTooltip="Evaluation Result Actions"
            />

            {/* View Duration - Direct component usage like ViewUserRole */}
            {view && (
                <EvaluationResultDetails
                    isOpen={view}
                    setIsOpen={setView}
                    currentId={data.id}
                    reloadData={reloadData}
                    DataList={DataList}
                />
            )}
        </>
    );
};

export default EvaluationResultsActions;
