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

const AlertDialogue = ({ isOpen, setIsOpen, handleContinue }) => {
  return (
    <AlertDialog className="z-[999]" open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-700">Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription className="text-neutral-1100">
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setIsOpen(false)}>
            Cancel
          </AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={() => {
              handleContinue(); // Trigger the continue action
              setIsOpen(false); // Close the dialog after action
            }}
          >
            Continue
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AlertDialogue;
