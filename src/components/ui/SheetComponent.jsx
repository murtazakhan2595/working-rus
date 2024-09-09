import React from 'react';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../../src/@/components/ui/sheet';
import { Button } from 'components/ui/button';

const SheetComponent = ({ sheetData, children, contentClassName }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="default">{sheetData.triggerText}</Button>
      </SheetTrigger>
      <SheetContent className={`${contentClassName} overflow-y-auto `}>
        <SheetHeader className="prose">
          <SheetTitle >{sheetData.title}</SheetTitle>
          <SheetDescription className="text-mauve-900">{sheetData.description}</SheetDescription>
        </SheetHeader>
        {children}
        <SheetFooter>
          {sheetData.footer}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default SheetComponent;
