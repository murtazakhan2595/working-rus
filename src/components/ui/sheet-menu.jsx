// done
import { Link } from 'react-router-dom';
import { MenuIcon, PanelsTopLeft } from "lucide-react";
import { Button } from "../../src/@/components/ui/button";
import Menu from "../../components/ui/menu";
import {
  Sheet,
  SheetHeader,
  SheetContent,
  SheetTrigger,
} from "../../src/@/components/ui/sheet";
import NavigationMenue from "../../app/shared/templates/Sidebar/NavigationMenue";
export function SheetMenu() {
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
            <Link href="/dashboard" className="flex items-center gap-2">
              <PanelsTopLeft className="w-6 h-6 mr-1" />
              <h1 className="text-lg font-bold">Brand</h1>
            </Link>
          </Button>
        </SheetHeader>
        <NavigationMenue isOpen  />
           
        {/* <Menu isOpen /> */}
      </SheetContent>
    </Sheet>
  );
}
