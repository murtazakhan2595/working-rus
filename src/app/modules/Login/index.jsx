import React, { useState } from "react";
import { BiShow } from "react-icons/bi";
import { TbEyeClosed } from "react-icons/tb";
import loginBg from "../.././../assets/images/login-bg.png";
import logo from "../.././../assets/images/tecbrix-logo.png";
import Joi from "joi";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { connect } from "react-redux";
import { setUserProfile, setToken } from "../../../state/actions/UserAction";

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Clear any existing validation errors
    setErrors({});
    const { error } = loginSchema.validate(values, { abortEarly: false });
    if (error) {
      const newErrors = {};
      error.details.forEach((detail) => {
        newErrors[detail.path[0]] = detail.message;
      });
      setErrors(newErrors);
      return; // Exit early if there are validation errors
    }

    try {
      let response = await axios.post(`${baseUrl}/token/`, {
        username: values.username,
        password: values.password,
      });


      if (response.status === 200) {
        cookies.set("token", response.data.access, { path: "*" });
        let token = cookies.get("token");
        let res = await axios.get(`${baseUrl}/user/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.status === 200) {
          handleUpdateProfile(res.data);
          setToken(token);
          setValues({});
          cookies.set("uname", values.username, { path: "*" });
          cookies.set("pwd", values.password, { path: "*" });
          toast.success("Login successful!", {
            position: toast.POSITION.TOP_RIGHT,
          });
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

  const loginSchema = Joi.object({
    username: Joi.string()
      .required("User Name Required")
      .label("UserName")
      .messages({
        "string.empty": `Enter Your Username`,
      }),
    password: Joi.string().required().label("Password").messages({
      "string.empty": `Enter Your Password`,
    }),
  });

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
              className="space-y-3 bg-white my-2 lg:py-12 py-6 rounded-3xl p-8 m-6 max-w-800 border border-gray-100 shadow-md"
              onSubmit={handleSubmit}
              method="POST"
            >
              <div>
                <h2 className="text-[#1176BC] text-center text-2xl lg:text-3xl font-montserrat font-[700] leading-9 tracking-tight py-4 mb-2">
                  Login Account
                </h2>
                <p className="text-center text-[#353535] lg:text-base text-sm font-montserrat pb-3 lg:pb-6">
                  Please Login to start your day and be productive at the best.
                </p>
              </div>
              <div>
                <div className="mt-2">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    title="Enter Your User Name"
                    placeholder="User Name"
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
                    id="password"
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

                <div className="text-sm text-right my-2">
                  <a
                    href="#"
                    className="font-semibold text-[#1176BC] hover:text-cyan-900 no-underline text-sm font-montserrat tracking-tight"
                  >
                    Forgot password ?
                  </a>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full mt-4 justify-center rounded-md bg-gradient-to-b from-[#25A5DE] to-[#1176BC] px-3 py-1.5 text-sm md:text-lg font-semibold 
                  leading-8 text-white shadow-sm hover:bg-cyan-900 focus-visible:outline focus-visible:outline-2 
                  focus-visible:outline-offset-2 focus-visible:outline-indigo-600 font-montserrat"
                >
                  Login
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
