import { Button } from "components/ui/button";
import React, { useEffect, useState, forwardRef } from "react";
import { DialogBox } from "components";
import { handleCloseWithConfirmation } from "components/SheetCardExtension";
import SheetComponent from "components/ui/CustomSheet";

const SheetUI = forwardRef(
  (
    {
      isOpen = true,
      setIsOpen = () => {},
      children,
      variant = "modal", // Can be 'modal' or 'sheet'
      sheetConfig = {
        triggerText: "Submit",
        title: "Form",
        description: null,
        footer: null,
        width: "678px", // Default width for sheet variant
      },
    },
    ref
  ) => {
    const [isCloseConfirmationOpen, setIsCloseConfirmationOpen] =
      useState(false);

    return (
      <>
        {/* Render close confirmation dialog if needed */}
        {isCloseConfirmationOpen &&
          handleCloseWithConfirmation({
            isOpen: isCloseConfirmationOpen,
            setCloseSheet: setIsCloseConfirmationOpen,
            setIsOpen,
          })}

        {variant === "modal" ? (
          // Render a dialog box when variant is 'modal'
          <DialogBox
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title={sheetConfig.title}
            description={sheetConfig.description}
            className={sheetConfig.className}
          >
            {children}
          </DialogBox>
        ) : variant === "modal" ? (
          // Render a sheet component when variant is 'sheet'
          <SheetComponent
            {...sheetConfig}
            width={sheetConfig.width}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
          >
            {children}
          </SheetComponent>
        ) : (
          { children }
        )}
      </>
    );
  }
);

export default SheetUI;
