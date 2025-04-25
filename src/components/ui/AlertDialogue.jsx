import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../src/@/components/ui/alert-dialog";
import { Button } from "./button";
import { cn } from "src/@/lib/utils";

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
            onClick={() => {
              handleContinue();
            }}
          >
            {continueText}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AlertDialogue;
