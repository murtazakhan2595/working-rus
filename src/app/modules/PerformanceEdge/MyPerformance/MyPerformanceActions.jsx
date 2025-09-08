import React, { useState } from "react";
import SheetComponent from "components/ui/SheetComponent";
import DropdownActionMenu from "components/DropdownActionMenu";
import AlertDialogue from "components/ui/AlertDialogue";
import { ViewHolidayDetail, AddUpdateHolidays } from "app/modules/LeaveTracker";
import { StartAssessmentForm } from "app/modules/PerformanceEdge";
import { toast } from "react-toastify";
import { deleteRecord } from "app/hooks/general";

const MyPerformanceActions = ({ data, reloadData = () => { }, DataList = [] }) => {
    const [view, setView] = useState(null);
    const [edit, setEdit] = useState(null);
    const [deleteDurationState, setDeleteDurationState] = useState(null);

    // Handle opening the view dialog
    const handleView = () => {
        setView(true);
    };

    // Handle opening the edit form
    const handleEdit = () => {
        setEdit(true);
    };


    const confirmDelete = async () => {
        try {
            await deleteRecord(`/evaluation-forms/${data.id}`, `${data.form_name}`);
            setDeleteDurationState(null);
            // Ensure table is reloaded by calling reload function
            reloadData(true);
        } catch (error) {
            console.error("ERROR", error);
        }
    };

    const isAssessmentComplted = data.status === 'completed';

    return (
        <>
            <DropdownActionMenu
                onView={isAssessmentComplted ? handleView : handleEdit}
                viewText={isAssessmentComplted ? 'View Assessment' : 'Start Assessment'}
                menuTooltip="Perfotmance Actions"
            />

            {/* Edit Duration Sheet */}
            {edit && (
                <StartAssessmentForm
                    isOpen={edit}
                    setIsOpen={setEdit}
                    id={data.id}
                    reloadData={reloadData}
                />
            )}

            {/* View Duration - Direct component usage like ViewUserRole */}
            {view && (
                <ViewHolidayDetail
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

export default MyPerformanceActions;
