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
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
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

    <div className="w-full container mx-auto lg:grid lg:min-h-[100vh] lg:grid-cols-2 xl:min-h-[100vh]">
      <div className="flex items-center justify-center ">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid justify-center gap-2 text-center">
            <div className="ml-auto mr-auto">
              <NewLogo />
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
              <div className="relative grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    to="/forgot-password"
                    className="inline-block ml-auto text-sm underline"
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
                  className={`absolute top-[25px] right-0 bg-transparent${showPassword ? "text-gray-400" : ""
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
        </div>
      </div>
      <div className="items-center justify-end hidden bg-white lg:flex">
        <img
          src={cover}
          alt="Login Image"
          className="object-cover min-h-full min-w-fit"
        />
      </div>
    </div>
  );
}

export default Login;
