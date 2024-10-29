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
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../src/@/components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Label } from "../../src/@/components/ui/label";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../src/@/components/ui/textarea";

const SheetComponent = ({
  title,
  description,
  formData,
  onSubmit,
  triggerText,
  width = "100%",
  isOpen,
  setIsOpen,
  children,
  contentClassName,
  footer,
}) => {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const handleInteractOutside = (e) => {
    e.preventDefault();
    setShowConfirmationModal(true);
  };

  const closeModal = () => {
    setShowConfirmationModal(false);
  };

  const handleDiscardChanges = () => {
    setShowConfirmationModal(false);
    setIsOpen(false);
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        {triggerText && (
          <SheetTrigger asChild>
            <Button variant="default">{triggerText}</Button>
          </SheetTrigger>
        )}
        <SheetContent
          style={{ width }}
          className={`${contentClassName} overflow-y-auto sm:max-w-4xl`}
          onInteractOutside={handleInteractOutside}
        >
          <SheetHeader className="prose text-left">
            <SheetTitle>{title}</SheetTitle>
            <SheetDescription className="text-mauve-900">
              {description}
            </SheetDescription>
          </SheetHeader>

          {children}
          {footer && (
            <SheetFooter>
              <SheetClose asChild>
                <Button variant="outline">Cancel</Button>
              </SheetClose>
              <Button type="submit" onClick={onSubmit}>
                Submit
              </Button>
            </SheetFooter>
          )}
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
              <Button variant="destructive" onClick={handleDiscardChanges}>
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
