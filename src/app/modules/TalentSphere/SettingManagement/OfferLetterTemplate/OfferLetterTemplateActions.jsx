import React, { useState } from "react";
import AlertDialogue from "components/ui/AlertDialogue";
import { deleteRecord } from "app/hooks/general";
import { AddUpdateOfferLetterTemplateForm } from "app/modules/TalentSphere";
import DropdownActionMenu from "components/DropdownActionMenu";
import { HasAccess } from "utils/PermissionUtils";
import { DialogBox, TextUI } from "components";

const OfferLetterTemplateActions = ({ data, DataList = [], reloadData = () => { } }) => {
    const isEditPermitted = HasAccess("EDIT_TS_OFFER_LETTER_TEMPLATES");
    // const isDeletePermitted = HasAccess("DELETE_TS_OFFER_LETTER_TEMPLATES");
    // const isViewPermitted = HasAccess("VIEW_MANPOWER");
    const [view, setView] = useState(null);
    const [openEditForm, setOpenEditForm] = useState(null);
    const [deleteForm, setDeleteForm] = useState(null);

    const handleEdit = (e) => {
        setOpenEditForm(true)
    };

    const handleDelete = () => {
        setDeleteForm(true);
    };
    const handleView = () => {
        setView(true);
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
                onEdit={isEditPermitted ? handleEdit : null}
                onView={handleView}
                // onDelete={isDeletePermitted ? handleDelete : null}
                viewText="Preview Template"
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
            {view && (
                <DialogBox
                    isOpen={view}
                    setIsOpen={setView}
                    title={data.name}
                    description={'Preview of offer Letter'}
                    className={'w-[90%]'}
                >
                    <TextUI text={data.body} isHTMLText={true} />

                </DialogBox>
            )}
        </>
    );
};
export default OfferLetterTemplateActions;
