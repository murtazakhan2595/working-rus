import { Navbar } from "../../components/ui/navbar"
import { useStore } from "../../app/hooks/use-store";
import { useSidebarToggle } from "../../app/hooks/use-sidebar-toggle";
import { Outlet} from "react-router-dom";
// import { className } from 'react-C-dom';
export function ContentLayout({ title, children , isSidebarOpen }) {
    const sidebar = useStore(useSidebarToggle, (state) => state);

    if (!sidebar) return null;
  
  return (
    <>
    <div className="nav">
      <Navbar title={title} />
    
    </div>
    <div className="Main-content rounded-[24px] bg-[#F0F1F2]">

      <Outlet isSidebarOpen={isSidebarOpen} />
    </div>
    </>
  )
}