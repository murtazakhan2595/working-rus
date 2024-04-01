import MobSidebar from "./MobSidebar";
import Sidebar from "./Sidebar";
const index = ({ isSidebarOpen, setIsSidebarOpen }) => {
  let width = window.screen.width;
  let val = width <= 1279 ? false : true;

  return (
    <>
      {val ? (
        <div>
          <Sidebar
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />
        </div>
      ) : (
        <div>
          <MobSidebar
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />
        </div>
      )}
    </>
  );
};

export default index;
