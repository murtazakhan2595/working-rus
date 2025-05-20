import  UserNavigation  from "./UserNavigation";
import { MenuSheet } from "./MenuSheet";
import { useNavigate } from 'react-router-dom';
import Notifications from "app/modules/Notifications";


function SideBarNavigation({ title, setUserLogout, ModuleList }) {
  const navigate = useNavigate();
  const handleLogout = () => {
    window.localStorage.setItem("token", "");
    setUserLogout();
    navigate("/login");
  };

  return (
    <>
      <header className="sticky top-0 z-0 w-full h-16 bg-white ">
        <div className="flex items-center mx-4 sm:mx-8 h-14">
          <div className="flex items-center space-x-4 lg:space-x-0">
            <MenuSheet ModuleList={ModuleList} />
          </div>

          <div className="flex items-center justify-end flex-1 space-x-2">
            {/* <SearchInput /> */}
            {/* <UserNotifications/>
             */}
            <Notifications />
            <UserNavigation setUserLogout={handleLogout} />
          </div>
        </div>
      </header>
    </>
  );
}


export { SideBarNavigation };
