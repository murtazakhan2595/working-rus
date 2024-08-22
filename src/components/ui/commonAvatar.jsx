// "use client";
// // done

// import { Link , useNavigate} from 'react-router-dom';
// import { LayoutGrid, LogOut, User } from "lucide-react";

// import { Button } from "./button";
// import { Avatar, AvatarFallback, AvatarImage } from "../../src/@/components/ui/avatar";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipTrigger,
//   TooltipProvider
// } from "../../src/@/components/ui/tooltip";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuGroup,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger
// } from "../../src/@/components/ui/dropdown-menu";
// import { setUserLogout } from "../../state/actions/UserAction";
// import { useSelector } from 'react-redux';
// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import getNavigation from 'app/utils/Types/Navigation';

// export function UserNav() {
//   const [employee, setEmployee] = useState(null);
//   const [profileImage, setProfileImage] = useState(null);
//   const token = window.localStorage.getItem("token");
//   const [Navigation, setNavigation] = useState(null);
//   const userProfile = useSelector((state) => state.user.userProfile);
//   const baseUrl = useSelector((state) => state.user.baseUrl);
//   const navigate = useNavigate();
  

//   const fetchData = async () => {
//     const employeeResponse = await axios.get(
//      `${baseUrl}/emp/${userProfile.id}`,
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
//   console.log(profileImage, "testing")

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const combineFLName = employee?.first_name?.charAt(0).toUpperCase() +  employee?.last_name?.charAt(0).toUpperCase() 

//   return (
//    <>
//                 <Avatar className="">
//                   <AvatarImage src={profileImage} alt="Avatar" />
//                   <AvatarFallback className="bg-transparent">{combineFLName}</AvatarFallback>

//                 </Avatar>
//              </>
//   );
// }

// export default UserNav;
