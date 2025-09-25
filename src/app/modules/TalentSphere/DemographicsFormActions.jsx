import React, { useState } from "react";
import DropdownActionMenu from "components/DropdownActionMenu";
import DemographicsSheet from "./DemographicsForm/DemographicsSheet";

export const DemographicsFormActions = ({
    data,
    DataList = [],
    reloadData = () => {},
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
                <DemographicsSheet
                    isOpen={view}
                    reloadData={() => {
                        reloadData();
                        setView(false);
                    }}
                    setIsOpen={() => setView(false)}
                    id={data.id}
                    mode="view"  
                />
            )}
        </>
    );
};
