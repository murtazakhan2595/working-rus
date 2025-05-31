import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "src/@/components/ui/dialog";
import "react-toastify/dist/ReactToastify.css"; // Toastify styles
import { cn } from "src/@/lib/utils";
import { ScrollArea } from "src/@/components/ui/scroll-area";

const DialogBox = ({
  isOpen,
  setIsOpen = () => {},
  children,
  title = "Title",
  description = "",
  className = "",
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className={cn(`flex flex-col`, className)}>
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <ScrollArea className="[&>div>div[style]]:!block">
          <div className="space-y-3 h-[70vh] px-4">
            {children}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default DialogBox;
