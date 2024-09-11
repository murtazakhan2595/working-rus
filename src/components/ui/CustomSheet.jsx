import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose, Button, Label, Input, Textarea } from '../../src/@/components/ui/sheet';

export default function CustomSheet({ title, description, formData, onSubmit }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader className="text-left">
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          {formData.map((field, index) => (
            <div key={index} className="grid items-center grid-cols-4 gap-4">
              <Label htmlFor={field.id} className="text-right">
                {field.label}
              </Label>
              {field.type === 'input' ? (
                <Input id={field.id} value={field.value} className="col-span-3" />
              ) : (
                <Textarea id={field.id} placeholder={field.placeholder} className="col-span-3" />
              )}
            </div>
          ))}
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
          <Button type="submit" onClick={onSubmit}>Submit</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
