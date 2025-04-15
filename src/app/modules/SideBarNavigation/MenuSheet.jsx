// done
import { Link } from 'react-router-dom';
import { MenuIcon } from "lucide-react";
import { Button } from "./button";
import Menu from "./Menu";
import {
  Sheet,
  SheetHeader,
  SheetContent,
  SheetTrigger,
} from "src/@/components/ui/sheet";

import MobileLogo from "../../assets/images/mobile-logo";
export function MenuSheet({userRole}) {
  return (
    <Sheet>
      <SheetTrigger className="lg:hidden" asChild>
        <Button className="h-8" variant="outline" size="icon">
          <MenuIcon size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col h-full px-3 sm:w-72" side="left">
        <SheetHeader>
          <Button
            className="flex items-center justify-center pt-1 pb-2"
            variant="link"
            asChild
          >
            <Link href="/" className="flex items-center gap-2">
            <MobileLogo/>
            </Link> 
          </Button>
        </SheetHeader>

        {/* <NavigationMenue isOpen  /> */}
           
        <Menu isOpen userRole={userRole}/>


      </SheetContent>
    </Sheet>
  );
}
