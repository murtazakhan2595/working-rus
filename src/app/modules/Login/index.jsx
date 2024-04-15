import React, { useEffect, useState } from "react";
import { BiShow } from "react-icons/bi";
import { TbEyeClosed } from "react-icons/tb";
import loginBg from "../.././../assets/images/login-bg.png";
import logo from "../.././../assets/images/tecbrix-logo.png";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { connect } from "react-redux";
import { setUserProfile, setToken } from "../../../state/actions/UserAction";
import OfflinePopUp from "./OfflinePopUp";

function Login({ setUserProfile, baseUrl, setToken }) {
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

  const handleUpdateProfile = (data) => {
    let updateProfile = { id: data.id, username: data.username };
    setUserProfile(updateProfile);
  };

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
        cookies.set("token", token, { path: "*" });

        // Fetch user profile with the obtained token
        const userProfileResponse = await axios.get(`${baseUrl}/user/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (userProfileResponse.status === 200) {
          const userProfile = {
            id: userProfileResponse.data.id,
            username: userProfileResponse.data.username,
          };

          // Update the user profile in the Redux store
          handleUpdateProfile(userProfile);

          // Update the token in the Redux store
          setToken(token);

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

          // Navigate to the desired location after a delay (e.g., 2 seconds)
          setTimeout(() => {
            navigate("/");
          }, 2000);
          return;
        }
      }

      // Simulating a response delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      toast.error(error.response.data.detail, {
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
    <div
      className="h-screen"
      style={{
        backgroundImage: `url(${loginBg})`,
        backgroundSize: "100% 100%",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        overflowY: "hidden",
      }}
    >
      <img
        src={logo}
        className="ml-6 mt-4 w-[150px] h-auto md:w-[160px] md:h-auto"
        alt="Tecbrix logo"
      />
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="flex justify-center items-center min-h-full">
          <div className="md:mx-auto md:w-fit w-full max-w-md">
            <form
              className="space-y-3 bg-white my-2 lg:py-10 py-6 rounded-3xl px-8 m-6 max-w-800 border border-gray-100 shadow-md"
              onSubmit={handleSubmit}
              method="POST"
            >
              <div className="w-80">
                <h2 className="text-[#1176BC] text-center text-2xl lg:text-3xl font-montserrat font-[700] leading-9 pb-4 tracking-tight">
                  Login Account
                </h2>
              </div>
              <div>
                <div className="mt-2">
                  <input
                    required
                    name="username"
                    type="text"
                    autoComplete="username"
                    title="Enter Your Username"
                    placeholder="Username"
                    value={values.username}
                    onChange={handleChange}
                    className="bg-zinc-100 w-full rounded-md py-2 my-1 text-gray-900 placeholder-style
   placeholder:text-gray-400 border-l-8 border-[#25A8E0] placeholder:mx-2 pl-2 md:text-base text-sm sm:leading-8 focus:outline-none font-montserrat"
                  />
                  <div className="text-sm text-rose-500">{errors.username}</div>
                </div>
              </div>

              <div>
                <div className="mt-4 relative">
                  <input
                    required
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    autoComplete="current-password"
                    title="Enter Your Password"
                    value={values.password}
                    onChange={handleChange}
                    className="bg-zinc-100 w-full rounded-md py-2 text-gray-900 placeholder-style placeholder:text-gray-400 border-l-8 border-[#25A8E0] placeholder:mx-2 pl-2  sm:leading-8 focus:outline-none md:text-base text-sm font-montserrat"
                  />

                  <button
                    type="button"
                    onClick={handlePasswordVisibility}
                    className={`absolute top-0 right-2 translate-y-[70%] ${showPassword ? "text-gray-400" : ""
                      }`}
                  >
                    {showPassword ? (
                      <BiShow className="text-gray-400" />
                    ) : (
                      <TbEyeClosed className="text-gray-400" />
                    )}
                  </button>
                  <div className="text-sm text-rose-500">{errors.password}</div>
                </div>
              </div>

              <div className="flex items-center gap-x-4">
                <button
                  type="submit"
                  className="flex justify-center items-center w-full mt-6 rounded-md bg-gradient-to-b from-[#25A5DE] to-[#1176BC] px-3 py-1.5 text-sm md:text-lg font-semibold 
    leading-8 text-white shadow-sm hover:bg-cyan-900 focus-visible:outline focus-visible:outline-2 
    focus-visible:outline-offset-2 focus-visible:outline-indigo-600 font-montserrat relative"
                  disabled={isLoading} // Disable button when loading
                >
                  {isLoading ? (
                    <span className="animate-pulse">Logging in...</span>
                  ) : (
                    <span>Login</span>
                  )}
                </button>
              </div>


              <div className="flex pb-2 items-center">
                <input
                  id="keepSignedIn"
                  name="keepSignedIn"
                  type="checkbox"
                  checked={isChecked}
                  onChange={handleCheckboxChange}
                  className="hidden"
                />
                <label
                  htmlFor="keepSignedIn"
                  className=" justify-start font-medium text-sm text-gray text-[#1176BC] font-montserrat tracking-tighter relative cursor-pointer pl-6 select-none"
                >
                  <span
                    className={`absolute left-0 top-0.5 w-4 h-4 rounded-sm ${isChecked ? "bg-[#25A8E0]" : "bg-[#EBEBEB]"
                      } transition-all duration-300`}
                    style={{
                      border: "none",
                    }}
                  >
                    {isChecked && (
                      <svg
                        className="w-3 h-3 text-white ml-0.5 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="4"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </span>
                  Keep me Signed In
                </label>
              </div>
            </form>
          </div>
        </div>
      </div>
      {isPopupVisible && <OfflinePopUp onClose={handleClosePopup} />}
      <ToastContainer />
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    userProfile: state.user.userProfile,
    token: state.user.token,
    baseUrl: state.user.baseUrl,
  };
};

export default connect(mapStateToProps, { setUserProfile, setToken })(Login);
