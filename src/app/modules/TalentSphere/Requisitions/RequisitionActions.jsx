import React, { useState } from "react";
import { ViewRequisitionRequest, AddUpdateRequisitionRequestForm } from "app/modules/TalentSphere";
import DropdownActionMenu from "components/DropdownActionMenu";
import { HasAccess } from "utils/PermissionUtils";

const GenerateRequisitionActions = ({ data, DataList = [], reloadData = () => { } }) => {
    const isEditPermitted = HasAccess("CREATE_REQUISITION_REQUEST");
    const [view, setView] = useState(null);
    const [edit, setEdit] = useState(null);
    const handleView = () => {
        setView(true)
    };
    const handleEdit = () => {
        setEdit(true)
    };
    return (
        <>
            <DropdownActionMenu
                onView={handleView}
                onEdit={isEditPermitted && data.is_draft ? handleEdit : null}
                viewText="View Requisition"
                editText="Edit Requisition"
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
            {edit && (
                <AddUpdateRequisitionRequestForm
                    isOpen={edit}
                    reloadData={() => {
                        reloadData(true);
                        setEdit(false);
                    }}
                    setIsOpen={() => {
                        setEdit(false);
                    }}
                    id={data.id}
                />
            )}
        </>
    );
};
export default GenerateRequisitionActions;
