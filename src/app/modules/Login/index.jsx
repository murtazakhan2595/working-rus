// Done
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
import { Link } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "./../../../src/@/components/ui/label";
import NewLogo from "../.././../assets/images/NewLogo";
import { setToken } from "../../../state/actions/UserAction.js";
import cover from "../../../assets/images/cover.jpg";

import { StepBack } from "lucide-react";

function Login() {
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
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false); // New state for loading indicator

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    const token = window.localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for internet connection
    if (!navigator.onLine) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(`${baseUrl}/token/`, {
        username: values.username,
        password: values.password,
      });

      if (response.status === 200) {
        const token = response.data.access;

        // Save the token in localStorage
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

          // Display success message
          toast.success("Login successful!", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1000,
          });

          if (userProfileResponse.data.is_filled) {
            // Perform hard refresh after setting the destination
            navigate("/");
            // window.location.reload();
          } else {
            navigate("/create-profile");
            // window.location.reload();
          }
          return;
        }
      }

      // Simulating a response delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.log(error);
      console.log(error?.response?.data?.detail ?? "Login Failed");
      toast.error(error?.response?.data?.detail ?? "Login Failed", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } finally {
      setIsLoading(false);
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

  return (
    <>
      <div className="max-w-full">
        <div className="absolute hidden top-3 right-3">
          <Button>
            <Link className="flex items-center" to="/">
              <StepBack className="w-4 h-4 mr-2" /> Go back
            </Link>
          </Button>
        </div>

        <div className={"lg:grid lg:grid-cols-2"}>
          <div className="flex items-center justify-center">
            <div className="grid gap-6 mx-auto">
              <div className="grid justify-center gap-2 text-center">
                <div className="ml-auto mr-auto">
                  <NewLogo />
                </div>
                <h1 className="text-3xl font-bold">Login</h1>
                <p className="text-balance text-muted-foreground">
                  Enter your credentials below to login to your account
                </p>
              </div>
              <div className="grid gap-4">
                <form className="" onSubmit={handleSubmit} method="POST">
                  <div className="grid gap-2">
                    <Label htmlFor="username">Username / Login ID</Label>
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
                    <div className="text-sm text-rose-500">
                      {errors.username}
                    </div>
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
                    <Input
                      id="password"
                      required
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      title="Enter Your Password"
                      value={values.password}
                      onChange={handleChange}
                      className=""
                    />
                    <Button
                      type="button"
                      onClick={handlePasswordVisibility}
                      className={`absolute top-7 right-0 bg-transparent${
                        showPassword ? "text-gray-400" : ""
                      }`}
                    >
                      {showPassword ? (
                        <BiShow className="text-plum-800" />
                      ) : (
                        <TbEyeClosed className="text-plum-800" />
                      )}
                    </Button>

                    <div className="text-sm text-rose-500">
                      {errors.password}
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Button type="submit" className="w-full">
                      {isLoading ? (
                        <span className="animate-pulse">Logging in...</span>
                      ) : (
                        <span>Log In</span>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="items-center hidden bg-white lg:flex">
            <img className="w-full max-h-screen" src={cover} alt="Login page Cover" />
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
