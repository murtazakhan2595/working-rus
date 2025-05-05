import { Navbar } from "components/ui/navbar";
import { useStore } from "app/hooks/use-store";
import { useSidebarToggle } from "app/hooks/use-sidebar-toggle";
import { Outlet } from "react-router-dom";
import { ScrollArea, ScrollBar } from "src/@/components/ui/scroll-area";

// import { className } from 'react-C-dom';
export function ContentLayout({ title, children, isSidebarOpen, userRole }) {
  const sidebar = useStore(useSidebarToggle, (state) => state);
  if (!sidebar) return null;
  return (
    <>
      <div className="nav">
        <Navbar title={title} userRole={userRole} />
      </div>
      <div className="main-content rounded-[24px] h-[calc(100vh_-_70px)]">
        <ScrollArea className="[&>div>div[style]]:!block">
          <div className="h-[calc(100vh_-_70px)] pr-4">
            <div className="pb-10">
            <Outlet isSidebarOpen={isSidebarOpen} />
            </div>
          </div>
        </ScrollArea>
      </div>
    </>
  );
}
