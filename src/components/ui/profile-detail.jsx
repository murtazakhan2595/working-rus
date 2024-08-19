/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { MdOutlineLogout, MdOutlineNotificationsNone } from "react-icons/md";
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaAngleDown } from "react-icons/fa";
import { Outlet, Link, useNavigate } from "react-router-dom";
import logo from "assets/images/logo.png";
import { connect, useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { BsPersonGear } from "react-icons/bs";
import { toggleDropdown } from "state/slices/DropdownSlice";
import getNavigation from "app/utils/Types/Navigation";
import { setUserLogout } from "state/actions/UserAction";
import Notifications from "../../app/shared/templates/Sidebar/Notifications/Notifications";

const ProfileDetailsTopbar = ({
  isSidebarOpen,
  setIsSidebarOpen,
  baseUrl,
  token,
  userProfile,
  sidebarRefresh,
}) => {
  const [profileImage, setProfileImage] = useState(null);
  const [employee, setEmployee] = useState(null);
  const [setNavigation] = useState(null);
  const { isProfileOpen } = useSelector((state) => state.dropdown);
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
  const fetchData1 = async () => {
    try {
      const employeeResponse = await axios.get(`${baseUrl}/emp/${userProfile?.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const employeeData = employeeResponse.data;
      setEmployee(employeeData);
      setNavigation(getNavigation(employeeData.user_role));
      setProfileImage(
        employeeResponse.data?.profile_picture?.file ||
        employeeResponse.data?.profile_picture
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  
  useEffect(() => {
    if (userProfile?.id) {
      fetchData1();
    }
  }, [userProfile]);
  console.log("User Profile:", userProfile);
console.log("User ID:", userProfile?.id);

  return (
    <>
    <div>

    <ProfileDetails
        profileImage={profileImage}
        employee={employee}
        handleToggleDropdown={handleToggleDropdown}
        isProfileOpen={isProfileOpen}
      />
    </div>
      
    </>
  );
};

const ProfileDetails = ({ employee, profileImage, handleToggleDropdown, isProfileOpen }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  const handleShowNotifications = () => {
    setShowNotifications((prev) => !prev);
  };

  const handleClose = () => {
    setShowNotifications(false);
  };

  return (
  <>
  <div>
  {profileImage ? (
            <img
              src={profileImage}
              alt={`${employee?.first_name} ${employee?.last_name}'s Picture`}
              style={{
                width: "45px",
                height: "45px",
                borderRadius: "50%",
              }}
            />
          ) : (
            <>
              {employee?.first_name?.toUpperCase().slice(0, 1)}
              {employee?.last_name?.toUpperCase().slice(0, 1)}
            </>
          )}
  </div>
   
          
          
          </>
         
        
  );
};

export default ProfileDetailsTopbar;
