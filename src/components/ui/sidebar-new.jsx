
// import { PanelsTopLeft } from "lucide-react";
import { Link } from 'react-router-dom';
import { cn } from "../../src/@/lib/utils";
import { useStore } from "../../app/hooks/use-store";
import { Button } from "./button";
import { useSidebarToggle } from "../../app/hooks/use-sidebar-toggle";
import  SidebarToggle  from "../../components/ui/sidebar-toggle";
import Menu from "../../components/ui/menu";
import NewLogo from './../../assets/images/NewLogo';
import MobileLogo from './../../assets/images/mobile-logo';
export function SidebarNew(userRole) {
  const sidebar = useStore(useSidebarToggle, (state) => state);

  
  if(!sidebar) return null;

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-20 h-screen -translate-x-full lg:translate-x-0 transition-[width] ease-in-out duration-300",
        sidebar?.isOpen === false ? "w-[100px]" : "w-72"
      )}
    >
      <SidebarToggle isOpen={sidebar?.isOpen} setIsOpen={sidebar?.setIsOpen} />
      <div className="relative flex flex-col justify-start h-full px-4 py-4 overflow-y-auto ">
        <Button
          className={cn(
            "transition-transform ease-in-out duration-300 mb-1",
            sidebar?.isOpen === false ? "translate-x-1" : "translate-x-0"
          )}
          variant="link"
          asChild
        >
          <Link href="/" className="flex justify-start gap-2 justify-items-start">
            {/* <PanelsTopLeft className="w-6 h-6 mr-1" /> */}
            <div className={cn(sidebar?.isOpen === false ? "-translate-x-0 opacity-100" : "translate-x-96 opacity-0 hidden") || " justify-start transition-[transform,opacity,display]"}>
            <MobileLogo />
            </div>
         
            <h1
              className={cn(
                "font-bold text-lg whitespace-nowrap transition-[transform,opacity,display] ease-in-out duration-300",
                sidebar?.isOpen === false
                  ? "-translate-x-96 opacity-0 hidden"
                  : "translate-x-0 opacity-100"
              )}
            >
              <NewLogo/>
            </h1>
          </Link>
        </Button>
        
        <Menu isOpen={sidebar?.isOpen} userRole={userRole}/>
      </div>
    </aside>
  );
}
