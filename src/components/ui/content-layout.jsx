import { Navbar } from "../../components/ui/navbar"
import { useStore } from "../../app/hooks/use-store";
import { useSidebarToggle } from "../../app/hooks/use-sidebar-toggle";
import { Outlet} from "react-router-dom";
// import { className } from 'react-C-dom';
export function ContentLayout({ title, children , isSidebarOpen, userRole }) {
    const sidebar = useStore(useSidebarToggle, (state) => state);

    if (!sidebar) return null;
  
  return (
    <>
    <div className="nav">
      <Navbar title={title} userRole={userRole}/>
    
    </div>
    <div className="main-content rounded-[24px] bg-mauve-200 screen">

      <Outlet isSidebarOpen={isSidebarOpen} />
    </div>
    </>
  )
}