import React, { useState } from "react";
import AlertDialogue from "components/ui/AlertDialogue";
import { deleteRecord } from "app/hooks/general";
import {AddUpdateCurrencyForm} from "app/modules/OfficeSetting/Screens";
import DropdownActionMenu from "components/DropdownActionMenu";
import { HasAccess } from "utils/PermissionUtils";

const CurrencyActions = ({ data, DataList = [], reloadData = () => { } }) => {
    const isEditPermitted = HasAccess("EDIT_TS_BENEFITS");
    const isDeletePermitted = HasAccess("DELETE_TS_BENEFITS");
    // const isViewPermitted = HasAccess("VIEW_MANPOWER");
    // const [view, setView] = useState(null);
    const [openEditForm, setOpenEditForm] = useState(null);
    const [deleteForm, setDeleteForm] = useState(null);

   console.log(data,)

    const handleEdit = (e) => {
        setOpenEditForm(true)
    };

    const handleDelete = () => {
        setDeleteForm(true);
    };

    const confirmDelete = async () => {
        try {
            await deleteRecord(`/currencies/${data.id}`, `${data.name}`);
            setDeleteForm(null);
            reloadData(true);
        } catch (error) {
            console.error("ERROR", error);
        }
    };

    return (
        <>
            <DropdownActionMenu
                // onView={isViewPermitted ? handleView : null}
                onEdit={isEditPermitted ? handleEdit : null}
                onDelete={isDeletePermitted ? handleDelete : null}
                viewText="View Currency"
                editText="Edit Currency"
                deleteText="Delete Currency"
                menuTooltip="Currency Actions"
            />

            {deleteForm && (
                <AlertDialogue
                    title="Confirm Delete?"
                    description={`This action can't be undone. All information associated with ${data.name} will be lost.`}
                    isOpen={deleteForm}
                    setIsOpen={(isOpen) =>
                        setDeleteForm(false)
                    }
                    handleContinue={confirmDelete}
                />
            )}

            {openEditForm && (
                <AddUpdateCurrencyForm
                    isOpen={openEditForm}
                    reloadData={() => {
                        reloadData(true);
                        setOpenEditForm(false);
                    }}
                    setIsOpen={() => {
                        setOpenEditForm(false);
                    }}
                    id={data.id}
                />
            )}
        </>
    );
};
export default CurrencyActions;
