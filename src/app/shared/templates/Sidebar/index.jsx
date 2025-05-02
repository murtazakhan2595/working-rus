// Rootpage
import { cn } from "../../../../src/@/lib/utils";
import { useStore } from "../../../hooks/use-store";
import { useSidebarToggle } from "../../../hooks/use-sidebar-toggle";
import { ContentLayout } from "../../../../components/ui/content-layout";
import { SidebarNew } from "components/ui/sidebar-new";

// const Main = ({ isSidebarOpen, setIsSidebarOpen }) => {

export default function Main({ userRole }) {
  const sidebar = useStore(useSidebarToggle, (state) => state);

  if (!sidebar) return null;

  return (
    <>
      <div className="sidebar">
        <SidebarNew userRole={userRole} />
      </div>

      <main
        // className={cn(
        //   "min-h-[calc(100vh_-_56px)]  transition-[margin-left] ease-in-out duration-300",
        //   sidebar?.isOpen === false ? "lg:ml-[90px]" : "lg:ml-72"
        // )}
         className={cn(
          "h-[100vh] overflow-hidden transition-[margin-left] ease-in-out duration-300",
          sidebar?.isOpen === false ? "lg:ml-[90px]" : "lg:ml-72"
        )}
      >
        <ContentLayout userRole={userRole} />
      </main>
    </>
  );
}
