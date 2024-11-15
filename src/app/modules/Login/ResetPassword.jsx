import React, { useEffect, useState } from "react";
import { BiShow } from "react-icons/bi";
import { TbEyeClosed } from "react-icons/tb";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { handleUpdateProfile } from "data/Data";
import { Link } from 'react-router-dom';
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "./../../../src/@/components/ui/label";
import NewLogo from "../.././../assets/images/NewLogo";
import { setToken } from '../../../state/actions/UserAction.js';
import enterNewpassword  from "../../../assets/images/enterNewPassword.jpg";
import { StepBack  } from 'lucide-react';

import { IoWarningOutline } from "react-icons/io5";

import { useLocation } from "react-router-dom";



import confirm from "../.././../assets/images/confirm.png";
import { PiCaretCircleLeftFill } from "react-icons/pi";


const ResetPassword = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const uid = searchParams.get("uid");
  const token = searchParams.get("token");

  console.log("UID:", uid);
  console.log("Token:", token);

  const baseUrl = useSelector((state) => state.user.baseUrl);

  console.log("i am baseurl from confirm", baseUrl);

  const initialData = { password: "", retype_password: "" };

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(initialData);
  const [passwordVisibility, setPasswordVisibility] = useState({
    password: false,
    retype_password: false,
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [response, setResponse] = useState(null);

  useEffect(() => {
    if (formData.password && formData.retype_password) {
      if (formData.password !== formData.retype_password) {
        setErrorMessage("Passwords do not match");
        setIsFormValid(false);
      } else {
        setErrorMessage("");
        setIsFormValid(true);
      }
    } else {
      setErrorMessage("");
      setIsFormValid(false);
    }
  }, [formData.password, formData.retype_password]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePasswordVisibility = (field) => {
    setPasswordVisibility({
      ...passwordVisibility,
      [field]: !passwordVisibility[field],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = {
      uid: uid,
      token: token,
      password: formData.password,
    };

    try {
      const res = await axios.post(
        `${baseUrl}/password/reset/confirm/`,
        payload
      );
      if (res.status === 200) {
        setResponse({ message: res.data.success, status: "success" });
      }
    } catch (error) {
      setResponse({
        message: error.response?.data?.error || "An error occurred",
        status: "error",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
      setFormData(initialData);
    }
  };

  return (
    <>
    <div className="container max-w-full mx-auto ">
        <div className="absolute top-3 right-3">
        <Button >
                
              <Link className="flex items-center" to="/"><StepBack  className="w-4 h-4 mr-2" /> Go back</Link> 
           </Button>
        </div>
            
        <div className={"lg:grid lg:grid-cols-2" }>
        <div className="flex items-center justify-center">
          <div className="grid gap-6 mx-auto">
            <div className="grid justify-center gap-2 text-center">
              <div className="ml-auto mr-auto">
                <NewLogo />
              </div>
              <h1 className="text-3xl font-bold">Enter New Password</h1>
              <p className="text-balance text-muted-foreground">
              Your new password must not be the same or contain the same
              password as your previous ones.
              </p>
            </div>
            <div className="grid gap-4">
            <form
              className="my-2 space-y-3 lg:py-10 md:py-6 md:px-8 md:m-6"
              onSubmit={handleSubmit}
              method="POST"
            ><div className="relative grid gap-2">
                          <Label htmlFor="newpassword">New password</Label>
                          <Input
                            id="newpassword"
                            required
                            name="newpassword"
                            type={passwordVisibility.password ? "text" : "password"}
                            title="Enter Your Password"
                            value={formData.password}
                            onChange={handleChange}
                          />
                          <Button
                  type="button"
                  onClick={() => handlePasswordVisibility("password")}
                  className={`absolute top-[25px] right-0 bg-transparent ${
                    passwordVisibility.password ? "text-gray-400" : ""
                  }`}
                >
                  {passwordVisibility.password ? (
                    <BiShow className="text-gray-400" />
                  ) : (
                    <TbEyeClosed className="text-gray-400" />
                  )}
                </Button>
                        </div>
                        <div className="relative grid gap-2">
                          <div className="flex items-center">
                            <Label htmlFor="password">Retype Password</Label>
                                                     </div>
                          <Input id="retype_password" required
                          
           
                  name="retype_password"
                  type={
                    passwordVisibility.retype_password ? "text" : "password"
                  }
                  title="Retype your password"
                  value={formData.retype_password}
                  onChange={handleChange}
                            className="" />
                          <Button
                            type="button"
                            onClick={handlePasswordVisibility}
                            className={`absolute top-[25px] right-0 bg-transparent${
                              passwordVisibility.retype_password ? "text-gray-400" : ""
                            }`}
                          >
                            {passwordVisibility.retype_password ? (
                              <BiShow className="text-gray-400" />
                            ) : (
                              <TbEyeClosed className="text-gray-400" />
                            )}
                          </Button>
                          {errorMessage && (
                <div className="mx-auto bg-[#FFF8F7] border border-[#F2DCDA] rounded-xl p-2 flex gap-x-2">
                  <p className=" text-[#F08278] text-[14px]">
                    {errorMessage}
                  </p>
                </div>
              )}
              {response && (
                <div
                  className={`mx-auto p-2 flex gap-x-2 rounded-xl ${
                    response.status === "success"
                      ? "bg-[#E6FFEA] border border-[#B6F2C2]"
                      : "bg-[#FFF8F7] border border-[#F2DCDA]"
                  }`}
                >
                  <p
                    className={` text-[14px] ${
                      response.status === "success"
                        ? "text-[#27A745]"
                        : "text-[#F08278]"
                    }`}
                  >
                    {response.message}
                  </p>
                </div>
              )}
                          
                        </div>
                        <div className="grid gap-2">
                        <Button type="submit" className={`flex h-11 justify-center items-center w-full font-normal rounded-xl  px-3 py-1.5 text-sm md:text-lg leading-8  lg:text-base ${
                    !isFormValid
                      ? "bg-[#F2F2F2] text-[#AFB0B2]"
                      : "bg-black text-white"
                  }`}
                  disabled={isLoading || !isFormValid}
                >
                  {isLoading ? (
                    <span className="animate-pulse">Resetting...</span>
                  ) : (
                    <span>Reset Password</span>
                  )}
                        </Button>
                        </div>
                        </form>
          </div>
        </div>
      </div>
      <div className="items-center hidden bg-white lg:flex">
        <img src={enterNewpassword} alt="Enter New Password page Cover Image" />       
      </div>
      </div>
     
    </div>
    </>
  );
};

export default ResetPassword;
