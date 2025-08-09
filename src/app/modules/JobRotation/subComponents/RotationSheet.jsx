import React, { useState } from "react";
import {SheetUI} from "components";
import { Button } from "components/ui/button";

export default function RotationSheetWrapper() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setIsSheetOpen(true)}>Rotation Request</Button>

      <SheetUI
        isOpen={isSheetOpen}
        setIsOpen={setIsSheetOpen}
        variant="sheet"
        sheetConfig={{
          title: "Rotation Sheet",
          width: "600px",
        }}
        formConfig={{
          initialValues: {},
          handleSubmit: () => {},
          formFields: [],
        }}
      >
        <p>Empty sheet content</p>

        {/* Close button */}
        <Button variant="outline" onClick={() => setIsSheetOpen(false)}>
          Close
        </Button>
      </SheetUI>
    </div>
  );
}
