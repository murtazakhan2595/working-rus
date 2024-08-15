import React, { useEffect, useState } from "react";
import { BiShow } from "react-icons/bi";
import { TbEyeClosed } from "react-icons/tb";
// import loginBg from "../.././../assets/images/login-bg.png";
import cover from "../.././../assets/images/cover.png";

import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NavLink, useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { connect } from "react-redux";
import { setUserProfile, setToken } from "../../../state/slices/UserSlice";
import OfflinePopUp from "./OfflinePopUp";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  fetchDepartments,
  fetchLeaveTypes,
  fetchDesignations,
} from "state/slices/CommonSlice";
import { handleUpdateProfile } from "data/Data";


import { Link } from 'react-router-dom';
import { Button } from "./../../../src/@/components/ui/button";
import { Input } from "./../../../src/@/components/ui/input";
import { Label } from "./../../../src/@/components/ui/label";
import NewLogo from "../.././../assets/images/NewLogo";

// function Login({ setUserProfile, baseUrl, setToken }) {
function Login() {
  let isLogin = useSelector((state) => state.user.isLogin);
  let baseUrl = useSelector((state) => state.user.baseUrl);

  let dispatch = useDispatch();

  const navigate = useNavigate();
  const cookies = new Cookies();
  const currentUname = cookies.get("uname");
  const currentPwd = cookies.get("pwd");
  const [values, setValues] = useState({
    username: currentUname ? currentUname : "",
    password: currentPwd ? currentPwd : "",
  });
  const [isChecked, setIsChecked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isPopupVisible, setPopupVisible] = useState(!navigator.onLine);
  const [isLoading, setIsLoading] = useState(false); // New state for loading indicator

  // const handleUpdateProfile = (data) => {
  //   dispatch(setUserProfile(data));
  //   dispatch(fetchDepartments());
  //   dispatch(fetchLeaveTypes());
  //   dispatch(fetchDesignations());
  // };

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleClosePopup = () => {
    setPopupVisible(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for internet connection
    if (!navigator.onLine) {
      // Show the custom pop-up with a message
      setPopupVisible(true);
      return;
    }

    setIsLoading(true); // Set loading state to true

    try {
      const response = await axios.post(`${baseUrl}/token/`, {
        username: values.username,
        password: values.password,
      });

      if (response.status === 200) {
        const token = response.data.access;

        // Save the token in cookies
        window.localStorage.setItem("token", token);

        // Fetch user profile with the obtained token
        const userProfileResponse = await axios.get(`${baseUrl}/user/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (userProfileResponse.status === 200) {
          // Update the user profile in the Redux store
          handleUpdateProfile(dispatch, userProfileResponse.data);

          // Update the token in the Redux store
          dispatch(setToken(token));

          // Clear form values
          setValues({
            username: "",
            password: "",
          });

          // Save username and password in cookies if "Keep me Signed In" is checked
          if (isChecked) {
            cookies.set("uname", values.username, { path: "*" });
            cookies.set("pwd", values.password, { path: "*" });
          }

          // Display success message
          toast.success("Login successful!", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1000,
          });

          if (userProfileResponse.data.is_filled) {
            navigate("/");
          } else {
            navigate("/create-profile");
          }
          return;
        }
      }

      // Simulating a response delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.log(error?.response?.data?.detail ?? "Login Failed");
      toast.error(error?.response?.data?.detail ?? "Login Failed", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedVal = { ...values, [name]: value };
    setValues(updatedVal);

    // Clear the specific field's validation error
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: undefined,
    }));
  };

  useEffect(() => {
    // Event listener for online/offline changes
    const handleConnectionChange = () => {
      setPopupVisible(!navigator.onLine);
    };

    // Attach event listener
    window.addEventListener("online", handleConnectionChange);
    window.addEventListener("offline", handleConnectionChange);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("online", handleConnectionChange);
      window.removeEventListener("offline", handleConnectionChange);
    };
  }, []);

  return (

    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center ">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center justify-center">
            <div  className="mr-auto ml-auto">
            <NewLogo/>
            </div>
            
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-balance text-muted-foreground">
              Enter your email below to login to your account
            </p>
          </div>
          <div className="grid gap-4">

            <form
              className=""
              onSubmit={handleSubmit}
              method="POST"
            ><div className="grid gap-2">

                <Label htmlFor="email">Email</Label>
                <Input
                  id="usrname"
                  required
                  name="username"
                  type="text"
                  autoComplete="username"
                  title="Enter Your Username"
                  value={values.username}
                  onChange={handleChange}
                />
                <div className="text-sm text-rose-500">{errors.username}</div>
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    to="/forgot-password"
                    className="ml-auto inline-block text-sm underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input id="password" required
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  title="Enter Your Password"
                  value={values.password}
                  onChange={handleChange}
                  className="" />
                <Button
                  type="button"
                  onClick={handlePasswordVisibility}
                  className={`absolute top-[23px] right-0 bg-transparent${showPassword ? "text-gray-400" : ""
                    }`}
                >
                  {showPassword ? (
                    <BiShow className="text-gray-400" />
                  ) : (
                    <TbEyeClosed className="text-gray-400" />
                  )}
                </Button>

                <div className="text-sm text-rose-500">{errors.password}</div>
              </div>
              <Button type="submit" className="w-full">
                {isLoading ? (
                  <span className="animate-pulse">Logging in...</span>
                ) : (
                  <span>Log In</span>
                )}
              </Button>



            </form>

          </div>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="#" className="underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <img
          src={cover}
          alt="Login Image"
          className=" min-w-fit min-h-full object-cover "
        />
      </div>
    </div>

    // <div className="h-screen flex justify-center">
    //   <div className="w-full md:w-[65%] flex flex-col min-h-full p-3 md:p-5 lg:p-7">
    //     <div className="flex justify-start items-start">
    //       <h1 className="text-center font-bold font-roboto">PlumPro</h1>
    //       {/* <img
    //         src={logo}
    //         className="w-[142px] h-auto md:h-auto lg:pl-5"
    //         alt="Tecbrix logo"
    //       /> */}
    //     </div>
    //     <div className="flex justify-center items-center flex-grow">
    //       <div className="md:mx-auto w-full max-w-md lg:max-w-xl">
    //         <form
    //           className="space-y-3 my-2 lg:py-10 md:py-6 md:px-8 md:m-6"
    //           onSubmit={handleSubmit}
    //           method="POST"
    //         >
    //           <div className="lg:block mx-auto">
    //             <h2 className="text-[#323333] text-center text-2xl lg:text-4xl font-lato font-bold leading-9 pb-4 tracking-tight">
    //               Log In
    //             </h2>
    //             <p className="font-roboto text-center text-[#5C5E64] font-normal text-base lg:mb-10">
    //               It's nice to see you again!
    //             </p>
    //           </div>

    //           <div className="">
    //             <Label
    //               htmlFor="username"
    //               className=" text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    //             >
    //               Login ID*
    //             </Label>
    //             <Input
    //               required
    //               name="username"
    //               type="text"
    //               autoComplete="username"
    //               title="Enter Your Username"
    //               value={values.username}
    //               onChange={handleChange}
    //               className=""
    //             />
    //             <div className="text-sm text-rose-500">{errors.username}</div>
    //           </div>

    //           <div className="relative">
    //             <div className="flex justify-between items-center">
    //               <Label
    //                 htmlFor="password"

    //               >
    //                 Password*
    //               </Label>
    //               <NavLink
    //                 to="/forgot-password"
    //                 className="text-[#323333] font-normal font-lato text-base underline underline-offset-4"
    //               >
    //                 Forgot your password?
    //               </NavLink>
    //             </div>
    //             <Input
    //               required
    //               name="password"
    //               type={showPassword ? "text" : "password"}
    //               autoComplete="current-password"
    //               title="Enter Your Password"
    //               value={values.password}
    //               onChange={handleChange}
    //               className=""
    //             />

    //             <Button
    //               type="button"
    //               onClick={handlePasswordVisibility}
    //               className={`absolute top-[23px] right-0 bg-transparent${showPassword ? "text-gray-400" : ""
    //                 }`}
    //             >
    //               {showPassword ? (
    //                 <BiShow className="text-gray-400" />
    //               ) : (
    //                 <TbEyeClosed className="text-gray-400" />
    //               )}
    //             </Button>

    //             <div className="text-sm text-rose-500">{errors.password}</div>
    //           </div>

    //           <div className="flex items-center gap-x-4">
    //             {/* <button
    //               type="submit"
    //               className="flex h-11 text-white justify-center items-center w-full font-normal rounded-xl bg-black px-3 py-1.5 text-sm md:text-lg leading-8 font-lato lg:text-base"
    //               disabled={isLoading} // Disable button when loading
    //             >
    //               {isLoading ? (
    //                 <span className="animate-pulse">Logging in...</span>
    //               ) : (
    //                 <span>Log In</span>
    //               )}
    //             </button> */}

    //             <Button type="submit" className="w-full bg-plum" disabled={isLoading}>
    //               {isLoading ? (
    //                 <span className="animate-pulse">Logging in...</span>
    //               ) : (
    //                 <span>Log In</span>
    //               )}
    //             </Button>
    //           </div>

    //           <div className="flex pb-2 items-center">
    //             <Input
    //               id="keepSignedIn"
    //               name="keepSignedIn"
    //               type="checkbox"
    //               checked={isChecked}
    //               onChange={handleCheckboxChange}
    //               className="hidden"
    //             />
    //             <Label
    //               htmlFor="keepSignedIn"
    //               className="justify-start font-medium text-sm text-gray text-[#5C5E64] font-montserrat tracking-tighter relative cursor-pointer pl-6 select-none"
    //             >
    //               <span
    //                 className={`absolute left-0 top-0.5 w-4 h-4 rounded-sm ${isChecked ? "bg-[#5C5E64]" : "bg-[#EBEBEB]"
    //                   } transition-all duration-300`}
    //                 style={{
    //                   border: "none",
    //                 }}
    //               >
    //                 {isChecked && (
    //                   <svg
    //                     className="w-3 h-3 text-white ml-0.5 mt-0.5"
    //                     fill="none"
    //                     stroke="currentColor"
    //                     viewBox="0 0 24 24"
    //                   >
    //                     <path
    //                       strokeLinecap="round"
    //                       strokeLinejoin="round"
    //                       strokeWidth="4"
    //                       d="M5 13l4 4L19 7"
    //                     />
    //                   </svg>
    //                 )}
    //               </span>
    //               Keep me signed in
    //             </Label>
    //           </div>
    //         </form>
    //       </div>
    //     </div>
    //     <div className="flex justify-start items-start">
    //       <p className="font-roboto font-normal text-base text-[#5C5E64] lg:pl-5">
    //         © 2024 TecBrix
    //       </p>
    //     </div>
    //   </div>

    //   <div className="w-0 md:w-1/2 lg:w-[35%] bg-gray-500 h-full">
    //     <img src={cover} alt="Meeting" className="object-cover w-full h-full" />
    //   </div>

    //   {isPopupVisible && <OfflinePopUp onClose={handleClosePopup} />}
    //   <ToastContainer />
    // </div>



  );
}

export default Login;
