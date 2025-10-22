import React, { useState, } from "react";
import { ViewApplicationDetail} from "app/modules/TalentSphere";
import DropdownActionMenu from "components/DropdownActionMenu";
const ApplicationActions = ({ data, DataList = [], reloadData = () => { }, isTeamView = false }) => {

    const [view, setView] = useState(null);
    const handleView = () => {
        setView(true)
    };
  
    return (
        <>
            <DropdownActionMenu
                onView={handleView}
                viewText="View Application"
                editText="Edit Application"
                deleteText="Schedule Interview"
                menuTooltip="Application Actions"
            />

            {view && (
                <ViewApplicationDetail
                    isOpen={view}
                    reloadData={() => {
                        reloadData(true);
                        setView(false);
                    }}
                    setIsOpen={() => {
                        setView(false);
                    }}
                    currentId={data.applicant_id}
                    DataList={DataList}
                />
            )}
        </>
    );
};
export default ApplicationActions;
