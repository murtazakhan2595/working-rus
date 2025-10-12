import React, { useState } from "react";
import AlertDialogue from "components/ui/AlertDialogue";
import { deleteRecord } from "app/hooks/general";
import { ViewFinalOffer, ViewOfferGenerated, GenerateOffer } from "app/modules/TalentSphere";
import DropdownActionMenu from "components/DropdownActionMenu";
import { HasAccess } from "utils/PermissionUtils";

const OfferRequestActions = ({ data, DataList = [], reloadData = () => { }, isOfferSent = false }) => {
    const isEditPermitted = HasAccess("ADD_TS_BENEFITS");
    // const isDeletePermitted = HasAccess("ADD_TS_BENEFITS");
    const isViewPermitted = HasAccess("VIEW_MANPOWER");
    const [view, setView] = useState(null);
    const [openEditForm, setOpenEditForm] = useState(null);
    const [generateOffer, setGenerateOffer] = useState(null);

    const handleEdit = (e) => {
        setOpenEditForm(true)
    };
    const handleView = (e) => {
        setView(true)
    };

    const handleGenerate = () => {
        setGenerateOffer(true);
    };

    return (
        <>
            <DropdownActionMenu
                onView={isViewPermitted ? handleView : null}
                onEdit={isEditPermitted && (data?.status === 'draft') ? handleEdit : null}
                onDelete={isEditPermitted && (data?.status === 'rejected') ? handleGenerate : null}
                // onDelete={isDeletePermitted ? handleDelete : null}
                viewText="View Offer"
                editText="Edit Offer"
                deleteText="Edit Offer"
                menuTooltip="Offer Actions"
            />

            {generateOffer && (
                <GenerateOffer
                    isOpen={generateOffer}
                    reloadData={() => {
                        reloadData(true);
                        setGenerateOffer(false);
                    }}
                    setIsOpen={() => {
                        setGenerateOffer(false);
                    }}
                    offer_id={data.id}
                />
            )}

            {openEditForm && (
                <GenerateOffer
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
            {view && !isOfferSent && (
                <ViewOfferGenerated
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
            {view && isOfferSent && (
                <ViewFinalOffer
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
export default OfferRequestActions;
