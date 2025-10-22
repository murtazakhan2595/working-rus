import React, { useState } from "react";
import { ViewInterviewDetails } from "app/modules/TalentSphere";
import DropdownActionMenu from "components/DropdownActionMenu";

const InterviewActions = ({ data, DataList = [], reloadData = () => { }, isTeamView = false }) => {
  
    const [view, setView] = useState(null);
    const [edit, setEdit] = useState(null);

    const handleView = () => {
        setView(true)
    };


    return (
        <>
            <DropdownActionMenu
                 onView={handleView}
                // onEdit={handleEdit}
                // onDelete={data.status === 'screened' ? handleDelete : null}
                viewText="View Details"
                editText="Edit Application"
                deleteText="Schedule Interview"
                menuTooltip="Interview Actions"
            />

            {view && (
                <ViewInterviewDetails
                    isOpen={view}
                    reloadData={() => {
                        reloadData(true);
                        setView(false);
                    }}
                    setIsOpen={() => {
                        setView(false);
                    }}
                    currentId={data.id}
                    DataList={DataList}
                    isTeamView={isTeamView}
                />
            )}
        </>
    );
};
export default InterviewActions;
