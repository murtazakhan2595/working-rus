import React, { useState } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../src/@/components/ui/sheet";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogCancel,
  DialogAction,
} from "../../src/@/components/ui/dialog";
import { Button } from "components/ui/button";

const SheetComponent = ({
  sheetData,
  children,
  contentClassName,
  isOpen,
  setIsOpen,
}) => {
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);

    const handleInteractOutside = (e) => {
      // e.preventDefault();
      // setShowConfirmationModal(true);
    };

    const closeModal = () => {
      setShowConfirmationModal(false);
    };

    const handleDiscardChanges = () => {
      setShowConfirmationModal(false);
      setIsOpen(false); // Close the sheet
    };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="default">{sheetData.triggerText}</Button>
        </SheetTrigger>
        <SheetContent
          className={`${contentClassName} overflow-y-auto sm:max-w-4xl`}
          onInteractOutside={handleInteractOutside}
        >
          <SheetHeader className="prose">
            <SheetTitle>{sheetData.title}</SheetTitle>
            <SheetDescription className="text-mauve-900">
              {sheetData.description}
            </SheetDescription>
          </SheetHeader>
          {children}
          <SheetFooter>{sheetData.footer}</SheetFooter>
        </SheetContent>
      </Sheet>
      {/* Confirmation Dialog */}
      {showConfirmationModal && (
        <Dialog
          open={showConfirmationModal}
          onOpenChange={setShowConfirmationModal}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you sure you want to close?</DialogTitle>
            </DialogHeader>
            <p>
              Any unsaved changes will be discarded. Do you want to proceed?
            </p>
          <DialogFooter>
            <Button variant="secondary" onClick={closeModal}>
              Keep
            </Button>
            <Button variant="danger" onClick={handleDiscardChanges}>
              Discard
            </Button>
          </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default SheetComponent;
