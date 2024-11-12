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

const AlertDialogue = ({ isOpen, setIsOpen, handleContinue , continueText = "Continue", description, title, cancelText ="Cancel", buttonType="destructive", className="bg-red-700"}) => {
  return (
    <AlertDialog className="z-[999]" open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className={className}>{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-neutral-1100">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setIsOpen(false)}>
            {cancelText}
          </AlertDialogCancel>
          <Button
            variant={buttonType}
            onClick={() => {
              handleContinue(); 
              setIsOpen(false); 
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
