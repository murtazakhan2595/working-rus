
import React, { useEffect, useState } from "react";
import { Button } from "components/ui/button";
import { errorClassName } from "components/FormControl";
import { CircleX } from "lucide-react";
import AlertDialogue from "components/ui/AlertDialogue";


export const AddNewSection = React.memo(
    ({ name, onChange = () => { }, value = [], error , defaultSection}) => {
        const handleClick = (event) => {
            event.preventDefault();
            event.stopPropagation();
            const updatedSections = [
                ...(value || []),
                { ...defaultSection },
            ];
            onChange(name, updatedSections);
        };
        return (
            <div>
                <Button variant="outline" onClick={handleClick}>
                    Add Section
                </Button>
                <div className={errorClassName}>{error}</div>
            </div>
        );
    }
);

export const AddNewSectionField = React.memo(
    ({ name, onChange = () => { }, value = [], error,defaultSectionField }) => {
        const handleClick = (event) => {
            event.preventDefault();
            event.stopPropagation();
            const updatedSections = [
                ...(value || []),
                { ...defaultSectionField },
            ];
            onChange(name, updatedSections);
        };
        return (
            <div>
                <Button variant="outline" onClick={handleClick}>
                    Add Field
                </Button>
                <div className={errorClassName}>{error}</div>
            </div>
        );
    }
);

export const RemoveSection = React.memo(
    ({ name, onChange = () => { }, value = [], index }) => {
        const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
        const handleClick = (event) => {
            event.preventDefault();
            event.stopPropagation();
            setOpenDeleteConfirm(true);
        };
        const confirmDelete = async () => {
            try {
                if (!index) return;
                const remaining = value.filter((_, objIndex) => objIndex !== index);
                setOpenDeleteConfirm(false);
                onChange(name, remaining || []);
            } catch (error) {
                console.error("ERROR", error);
            } finally {
                setOpenDeleteConfirm(false);
                return null;
            }
        };
        return (
            <div className="relative">
                <Button
                    variant="icon"
                    onClick={handleClick}
                    className="absolute top-[-20px] right-[-10px]"
                >
                    <CircleX size={22} className="text-red-700" />
                </Button>
                {openDeleteConfirm && (
                    <AlertDialogue
                        title={`Confirm Delete?${index}`}
                        description={`This action can't be undone. All information associated with this level will be lost.`}
                        isOpen={openDeleteConfirm}
                        setIsOpen={() => setOpenDeleteConfirm(false)}
                        handleContinue={confirmDelete}
                    />
                )}
            </div>
        );
    }
);

