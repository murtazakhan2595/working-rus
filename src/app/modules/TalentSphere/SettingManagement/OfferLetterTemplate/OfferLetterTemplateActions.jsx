import React, { useState } from "react";
import AlertDialogue from "components/ui/AlertDialogue";
import { deleteRecord } from "app/hooks/general";
import {AddUpdateOfferLetterTemplateForm} from "app/modules/TalentSphere";
import DropdownActionMenu from "components/DropdownActionMenu";
import { HasAccess } from "utils/PermissionUtils";

const OfferLetterTemplateActions = ({ data, DataList = [], reloadData = () => { } }) => {
    const isEditPermitted = HasAccess("EDIT_TS_BENEFITS");
    const isDeletePermitted = HasAccess("DELETE_TS_BENEFITS");
    // const isViewPermitted = HasAccess("VIEW_MANPOWER");
    // const [view, setView] = useState(null);
    const [openEditForm, setOpenEditForm] = useState(null);
    const [deleteForm, setDeleteForm] = useState(null);

   

    const handleEdit = (e) => {
        setOpenEditForm(true)
    };

    const handleDelete = () => {
        setDeleteForm(true);
    };

    const confirmDelete = async () => {
        try {
            await deleteRecord(`/recruitment-offer-letter-templates/${data.id}`, `${data.name}`);
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
                viewText="View Template"
                editText="Edit Template"
                deleteText="Delete Template"
                menuTooltip="Template Actions"
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
                <AddUpdateOfferLetterTemplateForm
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
export default OfferLetterTemplateActions;
