import { UserNav } from "./user-nav";
import { SheetMenu } from "./sheet-menu";
import { useNavigate } from 'react-router-dom';
import SearchInput  from "./search";
import UserNotifications from './user-notifications';


function Navbar({ title, setUserLogout }) {
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
          <SheetMenu />
        </div>

        <div className="flex items-center justify-end flex-1 space-x-2">
          <SearchInput />
          <UserNotifications/>
          <UserNav setUserLogout={handleLogout} />
        </div>
      </div>
    </header>
    </>
  );
}


export { Navbar };
