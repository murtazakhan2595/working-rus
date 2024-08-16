// Main Layout
import { useState, useEffect } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { toggleDropdown } from "state/slices/DropdownSlice";
import getNavigation from "app/utils/Types/Navigation";
import { setUserLogout } from "state/actions/UserAction";
import NavigationMenue from "./NavigationMenue";
import Notifications from "./Notifications/Notifications";

import { cn } from "../../../../src/@/lib/utils";
import { useStore } from "../../../hooks/use-store";
import { Button } from "../../../../src/@/components/ui/button";
import {Menu} from "../../../../components/ui/menu";
import { useSidebarToggle } from "../../../hooks/use-sidebar-toggle";
import { SidebarToggle } from "../../../../components/ui/sidebar-toggle";
import NewLogo from "../../../../assets/images/NewLogo"

const Sidebar = ({
  isSidebarOpen,
  setIsSidebarOpen,
  baseUrl,
  token,
  userProfile,
  sidebarRefresh,
}) => {

  const [profileImage, setProfileImage] = useState(null);
  const [employee, setEmployee] = useState(null);
  const [Navigation, setNavigation] = useState(null);
  const {
    isProfileOpen,
  } = useSelector((state) => state.dropdown);
  const dispatch = useDispatch();
  const handleToggleDropdown = (dropdownName) => {
    dispatch(toggleDropdown(dropdownName));
  };
  const handleSidebarToggle = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const fetchData = async () => {
    const employeeResponse = await axios.get(
      `${baseUrl}/emp/${userProfile.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const employeeData = employeeResponse.data;
    setEmployee(employeeData);
    setNavigation(getNavigation(employeeData.user_role));
    setProfileImage(
      employeeResponse.data?.profile_picture?.file ||
      employeeResponse.data?.profile_picture
    );
  };

  useEffect(() => {
    fetchData();
  }, []);
  const sidebar = useStore(useSidebarToggle, (state) => state);

  if (!sidebar) return null;

  return (
    <>
      <div className="flex flex-row">
        <aside
          className={cn(
            "fixed top-0 left-0 z-1 h-screen -translate-x-full lg:translate-x-0 transition-[width] ease-in-out duration-300",
            sidebar?.isOpen === false ? "w-[90px]" : "w-72"
          )}
        >

          <SidebarToggle isOpen={sidebar?.isOpen} setIsOpen={sidebar?.setIsOpen} />
          <Button
            className={cn(
              "transition-transform ease-in-out duration-300 mb-1",
              sidebar?.isOpen === false ? "translate-x-1" : "translate-x-0"
            )}
            variant="link"
            asChild
          >
            <Link to="/" className="flex items-center gap-2">
              <h1
                className={cn(
                  "font-bold text-lg whitespace-nowrap transition-[transform,opacity,display] ease-in-out duration-300",
                  sidebar?.isOpen === false
                    ? "-translate-x-96 opacity-0 hidden"
                    : "translate-x-0 opacity-100"
                )}
              >
               <NewLogo/>
              </h1>
            </Link>
          </Button>

          <div className={`mx-2 hideScroll ${isSidebarOpen ? "overflow-y-auto overflow-x-visible" : ""}`} style={{ height: `calc(100vh - ${isSidebarOpen ? isProfileOpen ? '290px' : '220px' : '200px'}` }}>
            <NavigationMenue navigation={Navigation} isSidebarOpen={isSidebarOpen} sidebarRefresh={sidebarRefresh} />
            {/* <Menu isOpen={sidebar?.isOpen} navigation={Navigation} isSidebarOpen={isSidebarOpen} sidebarRefresh={sidebarRefresh}  /> */}
          </div>

        </aside>
        {/* <Outlet isSidebarOpen={isSidebarOpen} /> */}
      </div>

    </>
  );
};

const mapStateToProps = (state) => {
  return {
    userProfile: state.user.userProfile,
    baseUrl: state.user.baseUrl,
    token: state.user.token,
    isLogin: state.user.isLogin,
    sidebarRefresh: state.user.sidebarRefresh,
  };
};
export default connect(mapStateToProps, { setUserLogout })(Sidebar);

