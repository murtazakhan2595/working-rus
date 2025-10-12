import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../src/@/components/ui/alert-dialog";
import { Button } from "./button";

const AlertDialogue = ({
  isOpen,
  setIsOpen,
  handleContinue,
  continueText = "Continue",
  description,
  title,
  cancelText = "Cancel",
  buttonType = "destructive",
  className = "text-red-700",
  customStyles = {},
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const handleConfirm = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsLoading(true)
    try {
      await handleContinue();
    } catch (error) { console.error(error); } finally { setIsLoading(false) }
  };
  return (
    <AlertDialog className="z-[999]" open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className={className}>{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-neutral-1100">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex gap-3">
          {customStyles.cancelButton ? (
            <Button
              className={customStyles.cancelButton}
              onClick={() => setIsOpen(false)}
            >
              {cancelText}
            </Button>
          ) : (
            <AlertDialogCancel onClick={() => setIsOpen(false)}>
              {cancelText}
            </AlertDialogCancel>
          )}

          <Button
            variant={buttonType}
            className={customStyles.continueButton}
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Loading....' : continueText}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AlertDialogue;
