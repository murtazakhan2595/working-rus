import React, { useState } from "react";
import AlertDialogue from "components/ui/AlertDialogue";
import { deleteRecord } from "app/hooks/general";
import { ViewHeadCountRequests } from "app/modules/TalentSphere";
import DropdownActionMenu from "components/DropdownActionMenu";
import { HasAccess } from "utils/PermissionUtils";

const HeadCountRequestsActions = ({ data, DataList = [], reloadData = () => { } }) => {
    const [view, setView] = useState(null);
    const handleView = () => {
        setView(true)
    };
    return (
        <>
            <DropdownActionMenu
                onView={handleView}
                viewText="View Headcount"
                menuTooltip="Headcount Actions"
            />

            {view && (
                <ViewHeadCountRequests
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
export default HeadCountRequestsActions;
