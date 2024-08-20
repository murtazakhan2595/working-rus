import { UserNav } from "./user-nav";
import { SheetMenu } from "./sheet-menu";
import { Bell } from "lucide-react";
import { Input } from "../../src/@/components/ui/input";
import Notifications  from "../../app/shared/templates/Sidebar/Notifications/Notifications";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
function Navbar({ title, setUserLogout }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  const handleShowNotifications = () => {
    setShowNotifications(true);
  };

  const handleClose = () => {
    setShowNotifications(false);
  };

  const handleLogout = () => {
    window.localStorage.setItem("token", "");
    setUserLogout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-0 w-full h-16 bg-white shadow-md">
      <div className="flex items-center mx-4 sm:mx-8 h-14">
        <div className="flex items-center space-x-4 lg:space-x-0">
          <SheetMenu />
        </div>

        <div className="flex items-center justify-end flex-1 space-x-2">
          <div className="relative flex-1 ml-auto md:grow-0">
            <Input
              type="search"
              placeholder="Search..."
              className="w-full rounded-full bg-background pl-8 md:w-[200px] lg:w-[336px]"
            />
          </div>
          
            <Bell className="text-xl" onClick={handleShowNotifications}/>
          
          {showNotifications && <Notifications onClose={handleClose} />}
          <UserNav setUserLogout={handleLogout} />
        </div>
      </div>
    </header>
  );
}


export { Navbar };
