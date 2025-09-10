import React, { useState } from "react";
import SheetComponent from "components/ui/SheetComponent";
import DropdownActionMenu from "components/DropdownActionMenu";
import AlertDialogue from "components/ui/AlertDialogue";
import { AddSelfAssessmentForm, StartAssessmentForm } from "app/modules/PerformanceEdge";
import { toast } from "react-toastify";
import { deleteRecord } from "app/hooks/general";

const SelfAssessmentFormActions = ({ data, reloadData = () => { }, DataList = [] }) => {
    const [view, setView] = useState(null);
    const [edit, setEdit] = useState(null);
    const [deleteDurationState, setDeleteDurationState] = useState(null);
    const [duplicate, setDuplicate] = useState(null);

    // Handle opening the view dialog
    const handleView = () => {
        setView(true);
    };

    // Handle opening the edit form
    const handleEdit = () => {
        setEdit(true);
    };

    // Handle delete
    const handleDelete = () => {
        setDeleteDurationState({
            open: true,
            data: data,
        });
    };

    const handleDuplicate = () => {
        setDuplicate(true);
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

    return (
        <>
            <DropdownActionMenu
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                viewText="Preview Form"
                editText="Edit Form"
                deleteText="Delete Form"
                menuTooltip="Form Actions"
                additionalOptionsConfig={[{ text: 'Duplicate Form', action: handleDuplicate }]}
            />

            {deleteDurationState?.open && (
                <AlertDialogue
                    title="Confirm Delete?"
                    description={`This action can't be undone. All information associated with "${data?.form_name}" will be lost.`}
                    isOpen={deleteDurationState.open}
                    setIsOpen={(isOpen) =>
                        setDeleteDurationState((prev) => ({ ...prev, open: isOpen }))
                    }
                    handleContinue={confirmDelete}
                />
            )}

            {/* Duplicate Sheet */}
            {duplicate && (
                <AddSelfAssessmentForm
                    isOpen={duplicate}
                    setIsOpen={setDuplicate}
                    id={data.id}
                    reloadData={reloadData}
                    isDuplicate={true}
                />
            )}

            {/* Edit Duration Sheet */}
            {edit && (
                <AddSelfAssessmentForm
                    isOpen={edit}
                    setIsOpen={setEdit}
                    id={data.id}
                    reloadData={reloadData}
                />
            )}

            {/* View Duration - Direct component usage like ViewUserRole */}
            {view && (
                <StartAssessmentForm
                    isOpen={view}
                    setIsOpen={setView}
                    currentId={data.id}
                    reloadData={reloadData}
                    DataList={DataList}
                    id={data.id}
                    PreviewOnly={true}
                />
            )}
        </>
    );
};

export default SelfAssessmentFormActions;
