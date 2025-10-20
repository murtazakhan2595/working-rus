import React, { useState } from "react";
import DropdownActionMenu from "components/DropdownActionMenu";
import DemographicsSheet from "./DemographicsSheet";
import ViewDemographicForm from "./ViewDemographicForm"

export  const DemographicsFormActions = ({
    data,
    DataList = [],
    reloadData = () => { },
}) => {
    const [view, setView] = useState(false);
    const [openEditForm, setOpenEditForm] = useState(false);

    const handleView = () => setView(true);
    const handleEdit = () => setOpenEditForm(true);

    return (
        <>
            <DropdownActionMenu
                viewText="View Form"
                editText="Edit Form"
                menuTooltip="Demographics Form Actions"
                onView={handleView}
                onEdit={handleEdit}
            />

            {/* Edit Form */}
            {openEditForm && (
                <DemographicsSheet
                    isOpen={openEditForm}
                    reloadData={() => {
                        reloadData(true);
                        setOpenEditForm(false);
                    }}
                    setIsOpen={() => setOpenEditForm(false)}
                    id={data.id}
                    mode="edit"
                />
            )}

            {/* View Form */}
            {view && (
                <ViewDemographicForm
                    isOpen={view}
                    reloadData={(shouldClose = false) => {
                        reloadData();
                        if (shouldClose) setView(false);
                    }}
                    setIsOpen={() => setView(false)}
                    currentId={data.id}
                    DataList={DataList}
                    mode="view"
                />
            )}
        </>
    );
};
