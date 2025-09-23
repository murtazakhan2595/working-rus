import React, { useState } from "react";
import { ViewRequisitionRequest } from "app/modules/TalentSphere";
import DropdownActionMenu from "components/DropdownActionMenu";

const GenerateRequisitionActions = ({ data, DataList = [], reloadData = () => { } }) => {
    const [view, setView] = useState(null);
    const handleView = () => {
        setView(true)
    };
    return (
        <>
            <DropdownActionMenu
                onView={handleView}
                viewText="View Requisition"
                menuTooltip="Requisition Actions"
            />

            {view && (
                <ViewRequisitionRequest
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
                />
            )}
        </>
    );
};
export default GenerateRequisitionActions;
