// Rootpage
// import  {SidebarNew}  from "../../../../components/ui/sidebar-new";
import { Navbar } from "../../../../components/ui/navbar";
import Sidebar from "../../../../app/shared/templates/Sidebar/Sidebar"
import { cn } from "../../../../src/@/lib/utils";
import { useStore } from "../../../hooks/use-store";
import { useSidebarToggle } from "../../../hooks/use-sidebar-toggle";
import {ContentLayout} from "../../../../components/ui/content-layout"
import { SidebarNew } from "components/ui/sidebar-new";
import  ProfileDetailsTopbar from "components/ui/profile-detail";
// const Main = ({ isSidebarOpen, setIsSidebarOpen }) => {

  export default function Main({ children, isSidebarOpen, setIsSidebarOpen }) {
    const sidebar = useStore(useSidebarToggle, (state) => state);
  
    if (!sidebar) return null;


  return (
    <>
     <div className="sidebar">
          <SidebarNew />
        </div>
           
        <main
        className={cn(
          "min-h-[calc(100vh_-_56px)] bg-zinc-50 dark:bg-zinc-900 transition-[margin-left] ease-in-out duration-300",
          sidebar?.isOpen === false ? "lg:ml-[90px]" : "lg:ml-72"
        )}
      > <ContentLayout/>
        

       
      </main>
     
       
     
    </>
  );
};


