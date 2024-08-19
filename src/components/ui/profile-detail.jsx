// /* eslint-disable react-hooks/exhaustive-deps */
// import { useState, useEffect } from "react";
// import { MdOutlineLogout, MdOutlineNotificationsNone } from "react-icons/md";
// import {
//   FaAngleDoubleLeft,
//   FaAngleDoubleRight,
// } from "react-icons/fa";
// import { FaAngleDown } from "react-icons/fa6";
// import { Outlet, Link, useNavigate } from "react-router-dom";
// import logo from "assets/images/logo.png";
// import { connect } from "react-redux";
// import axios from "axios";
// import { BsPersonGear } from "react-icons/bs";
// import { useSelector } from "react-redux";
// import { useDispatch } from "react-redux";
// import { toggleDropdown } from "state/slices/DropdownSlice";
// import getNavigation from "app/utils/Types/Navigation";
// import { setUserLogout } from "state/actions/UserAction";
// import { Notifications } from "../../app/shared/templates/Notifications/Notifications";


// const ProfileDetailsTopbar = ({
//   isSidebarOpen,
//   setIsSidebarOpen,
//   baseUrl,
//   token,
//   userProfile,
//   sidebarRefresh,
// }) => {

//   const [profileImage, setProfileImage] = useState(null);
//   const [employee, setEmployee] = useState(null);
//   const [ setNavigation] = useState(null);
//   const {
//     isProfileOpen,
//   } = useSelector((state) => state.dropdown);
//   const dispatch = useDispatch();
//   const handleToggleDropdown = (dropdownName) => {
//     dispatch(toggleDropdown(dropdownName));
//   };
//   const handleSidebarToggle = () => {
//     setIsSidebarOpen((prev) => !prev);
//   };

//   const fetchData = async () => {
//     const employeeResponse = await axios.get(
//       `${baseUrl}/emp/${userProfile.id}`,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );
//     const employeeData = employeeResponse.data;
//     setEmployee(employeeData);
//     setNavigation(getNavigation(employeeData.user_role));
//     setProfileImage(
//       employeeResponse.data?.profile_picture?.file ||
//       employeeResponse.data?.profile_picture
//     );
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);


//   return (
//     <>
//      <ProfileDetails isSidebarOpen={isSidebarOpen} profileImage={profileImage} employee={employee} handleToggleDropdown={handleToggleDropdown} isProfileOpen={isProfileOpen} />

//     </>
//   );
// };

// // render notifications


// const ProfileDetails = ({ isSidebarOpen, employee, profileImage, handleToggleDropdown, isProfileOpen }) => {

//   const [showNotifications, setShowNotifications] = useState(false);

//   const navigate = useNavigate();
//   const handleShowNotifications = () => {
//     setShowNotifications(prev => !prev)
//   }

//   const handleClose = () => {
//     setShowNotifications(false)
//   }
//   return (
//     <div className="pb-2 mx-2">
//       <div className="flex items-center gap-x-3 text-[#5C5E64] flex-grow ml-2 cursor-pointer my-3" onClick={handleShowNotifications}>
//         <MdOutlineNotificationsNone className="text-xl" />
//         <div className={`flex-grow text-[14px] ${isSidebarOpen ? 'block' : 'hidden'}`}>Notifications</div>
//       </div>
//       {showNotifications && <Notifications onClose={handleClose} />}
//       <div
//         className={`${isSidebarOpen
//           ? "bg-white rounded-lg border border-gray-200 shadow-bottom mb-3 mt-1"
//           : ""
//           }`}
//       >
//         <div
//           className={`flex group items-center gap-x-2 py-3 ${isSidebarOpen
//             ? "bg-[#F0F1F2]"
//             : "borderr border--[#5C5E64]"
//             } px-2 rounded-lg cursor-pointer`}
//         >
//           {profileImage ? (
//             <img
//               src={profileImage}
//               alt={`${employee?.first_name} ${employee?.last_name}'s Picture`}
//               style={{
//                 width: "45px",
//                 height: "45px",
//                 borderRadius: "50%",
//               }}
//             />
//           ) : (
//             <>
//               {employee?.first_name?.toUpperCase().slice(0, 1)}
//               {employee?.last_name?.toUpperCase().slice(0, 1)}
//             </>
//           )}

//           {!isSidebarOpen && (
//             <div
//               className="absolute z-50 ml-20 text-sm bg-white border rounded-lg border-gray-1 w-44 opacity-00 group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 shadow-bottom"
//               style={{ bottom: "5px" }}
//             >
//               <div className="flex items-center bg-[#F0F1F2] rounded-lg m-1">
//                 <div
//                   className={`flex group items-center gap-x-2 py-3 px-2 rounded-lg cursor-pointer`}
//                 >
//                   {profileImage ? (
//                     <img
//                       src={profileImage}
//                       alt={`${employee?.first_name} ${employee?.last_name}'s Picture`}
//                       style={{
//                         width: "45px",
//                         height: "45px",
//                         borderRadius: "50%",
//                       }}
//                     />
//                   ) : (
//                     <>
//                       {employee?.first_name
//                         ?.toUpperCase()
//                         .slice(0, 1)}
//                       {employee?.last_name?.toUpperCase().slice(0, 1)}
//                     </>
//                   )}
//                 </div>
//                 <div className={`flex flex-col text-[#5C5E64]`}>
//                   <div className="flex items-center gap-x-2">
//                     <div className="font-semibold">
//                       {employee?.username}
//                     </div>
//                   </div>
//                   <div
//                     className="overflow-hidden text-xs text-ellipsis"
//                     style={{ width: "100px" }}
//                   >
//                     {employee?.work_email}
//                   </div>
//                 </div>
//               </div>
//               <div className="flex flex-col mx-1 mt-2 gap-y-2">
//                 <Link
//                   to="/my-profile"
//                   className="flex items-center justify-between px-3 py-1 rounded-md hover:bg-[#DAEFF8] text-[#616366] text-sm hover:text-[#0D2282]"
//                 >
//                   <p>Profile Settings</p>
//                   <BsPersonGear />
//                 </Link>
//                 <div
//                   className="flex items-center cursor-pointer justify-between px-3 py-1 mb-1 rounded-md hover:bg-[#DAEFF8] text-[#616366] text-sm hover:text-[#0D2282]"
//                   onClick={() => {
//                     window.localStorage.setItem("token", "")
//                     setUserLogout();
//                     navigate("/login");
//                   }}
//                 >
//                   <p>Logout</p>
//                   <MdOutlineLogout />
//                 </div>
//               </div>
//             </div>
//           )}

//           <div
//             className={`flex flex-col text-[#5C5E64] ${isSidebarOpen ? "block" : "hidden"
//               }`}
//             onClick={() => handleToggleDropdown("Profile")}
//           >
//             <div className="flex items-center gap-x-2">
//               <div className="font-semibold">
//                 {employee?.username}
//               </div>
//               <FaAngleDown
//                 className={`text-xs transition-transform duration-300 ${isProfileOpen ? "transform rotate-180" : ""
//                   }`}
//               />
//             </div>
//             <div
//               className="overflow-hidden text-xs text-ellipsis"
//               style={{ width: "130px" }}
//             >
//               {employee?.work_email}
//             </div>
//           </div>
//         </div>

//         {isProfileOpen && isSidebarOpen && (
//           <div className="flex flex-col mt-2 gap-y-2">
//             <Link
//               to="/my-profile"
//               className="flex items-center justify-between px-3 py-1 rounded-md hover:bg-[#DAEFF8] text-[#616366] text-sm hover:text-[#0D2282]"
//             >
//               <p>Profile Settings</p>
//               <BsPersonGear />
//             </Link>
//             <div
//               className="flex items-center cursor-pointer justify-between px-3 py-1 rounded-md hover:bg-[#DAEFF8] text-[#616366] text-sm hover:text-[#0D2282]"
//               onClick={() => {
//                 window.localStorage.setItem("token", "")
//                 setUserLogout();
//                 navigate("/login");
//               }}
//             >
//               <p>Logout</p>
//               <MdOutlineLogout />
//             </div>
//           </div>
//         )}
//       </div>
//     </div>)
// }

// const mapStateToProps = (state) => {
//   return {
//     userProfile: state.user.userProfile,
//     baseUrl: state.user.baseUrl,
//     token: state.user.token,
//     isLogin: state.user.isLogin,
//     sidebarRefresh: state.user.sidebarRefresh,
//   };
// };
// export default connect(mapStateToProps, { setUserLogout })(ProfileDetailsTopbar);