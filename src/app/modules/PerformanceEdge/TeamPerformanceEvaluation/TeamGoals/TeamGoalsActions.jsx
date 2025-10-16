import React, { useState } from "react";
import DropdownActionMenu from "components/DropdownActionMenu";
import AlertDialogue from "components/ui/AlertDialogue";
import { AddUpdateMyGoals, ViewMyGoalsDetails } from "app/modules/PerformanceEdge";
import { deleteRecord } from "app/hooks/general";

const TeamGoalsActions = ({ data, reloadData = () => { }, DataList = [] }) => {
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

    // Handle delete
    const handleDelete = () => {
        setDeleteDurationState({
            open: true,
            data: data,
        });
    };

    const confirmDelete = async () => {
        try {
            await deleteRecord(`/EmployeeGoal/${data.id}`, `${data.title}`);
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
                //  onEdit={handleEdit}
                // onDelete={handleDelete}
                viewText="View Goals"
                editText="Edit Goals"
                // deleteText="Delete Goals"
                menuTooltip="Goals Actions"
            />

            {deleteDurationState?.open && (
                <AlertDialogue
                    title="Confirm Delete?"
                    description={`This action can't be undone. All information associated with "${data?.title}" will be lost.`}
                    isOpen={deleteDurationState.open}
                    setIsOpen={(isOpen) =>
                        setDeleteDurationState((prev) => ({ ...prev, open: isOpen }))
                    }
                    handleContinue={confirmDelete}
                />
            )}

            {/* Edit Duration Sheet */}
            {edit && (
                <AddUpdateMyGoals
                    isOpen={edit}
                    setIsOpen={setEdit}
                    id={data.id}
                    reloadData={reloadData}
                />
            )}

            {/* View Duration - Direct component usage like ViewUserRole */}
            {view && (
                <ViewMyGoalsDetails
                    isOpen={view}
                    setIsOpen={setView}
                    currentId={data.id}
                    reloadData={reloadData}
                    DataList={DataList}
                    managerView={true}
                />
            )}
        </>
    );
};

export default TeamGoalsActions;
