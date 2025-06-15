// Rootpage
import { cn } from "../../../../src/@/lib/utils";
import { useStore } from "../../../hooks/use-store";
import { useSidebarToggle } from "../../../hooks/use-sidebar-toggle";
import { ContentLayout } from "../../../../components/ui/content-layout";
import { SideBarMenu } from "app/modules/SideBarNavigation/SideBarMenu";

// const Main = ({ isSidebarOpen, setIsSidebarOpen }) => {

export default function Main({ ModuleList = [] }) {
  const sidebar = useStore(useSidebarToggle, (state) => state);

  if (!sidebar) return null;

  return (
    <>
      <div className="sidebar">
        <SideBarMenu />
      </div>

      <main
        className={cn(
          "h-[100vh] overflow-hidden transition-[margin-left] ease-in-out duration-300",
          sidebar?.isOpen === false ? "lg:ml-[90px]" : "lg:ml-72"
        )}
      >
        <ContentLayout ModuleList={ModuleList} />
      </main>
    </>
  );
}
