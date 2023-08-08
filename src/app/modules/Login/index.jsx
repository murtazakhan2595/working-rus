import React, { useState } from "react";
import { BiShow, BiHide } from "react-icons/bi";

function Login() {
  const [login, setLogin] = useState({ email: "", password: "" });
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email:", login.email);
    console.log("Password:", login.password);
    setLogin({ email: "", password: "" });
  };
  const [showPassword, setShowPassword] = useState(false);

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div
      className="h-screen"
      style={{
        backgroundImage: "url(/login-bg.png)",
        backgroundSize: "100% 100%",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        overflowY: "hidden",
      }}
    >
      <img
        src="./Tecbrix-logo.png"
        className="ml-6 mt-4 w-[150px] h-auto md:w-[160px] md:h-auto"
        alt="Tecbrix logo"
      />
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="flex justify-center items-center min-h-full">
          <div className="md:mx-auto sm:mx-auto md:w-fit w-full max-w-md">
            <form
              className="space-y-3 bg-white my-2 lg:py-12 py-4 rounded-3xl shadow-md p-8 m-6 max-w-800 shadow-xl border border-gray-100 shadow-custom"
              onSubmit={handleSubmit}
              method="POST"
            >
              <div>
                <h2 className="text-[#1176BC] text-center text-2xl lg:text-3xl font-montserrat font-[700] leading-9 tracking-tight py-4 mb-2">
                  Login Account
                </h2>
                <p className="text-center text-center text-[#353535] lg:text-base text-sm font-montserrat pb-3 lg:pb-6">
                  Please Login to start your day and be productive at the best.
                </p>
              </div>
              <div>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    title="Enter Your Email"
                    placeholder="Email ID"
                    required
                    value={login.email}
                    onChange={(e) =>
                      setLogin({ ...login, email: e.target.value })
                    }
                    className="bg-zinc-100 w-full rounded-md py-2 my-1 text-gray-900 placeholder-style
   placeholder:text-gray-400 border-l-8 border-[#25A8E0] placeholder:mx-2 pl-2 md:text-base text-sm sm:leading-8 focus:outline-none font-montserrat"
                  />
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
                    required
                    value={login.password}
                    onChange={(e) =>
                      setLogin({ ...login, password: e.target.value })
                    }
                    className="bg-zinc-100 w-full rounded-md py-2 text-gray-900 placeholder-style placeholder:text-gray-400 border-l-8 border-[#25A8E0] placeholder:mx-2 pl-2  sm:leading-8 focus:outline-none md:text-base text-sm font-montserrat"
                  />
                  <button
                    type="button"
                    onClick={handlePasswordVisibility}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword ? (
                      <BiHide className="text-[#1176BC]" />
                    ) : (
                      <BiShow className="text-[#1176BC]" />
                    )}
                  </button>
                </div>

                <div className="text-sm text-right my-2">
                  <a
                    href="#"
                    className="font-semibold text-[#1176BC] hover:text-cyan-900 no-underline text-sm"
                  >
                    Forgot password ?
                  </a>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full mt-4 justify-center rounded-md bg-gradient-to-r from-[#25A5DE] to-[#1176BC] px-3 py-1.5 text-lg font-semibold 
              leading-8 text-white shadow-sm hover:bg-cyan-900 focus-visible:outline focus-visible:outline-2 
              focus-visible:outline-offset-2 focus-visible:outline-indigo-600 font-montserrat font-black"
                >
                  Login
                </button>
              </div>
              <div className="flex pb-2">
                <input
                  id="keepSignedIn"
                  name="keepSignedIn"
                  type="checkbox"
                  checked={isChecked}
                  onChange={handleCheckboxChange}
                  className="justify-start w-3 rounded text-cyan-500 focus:ring-indigo-500"
                />
                <label
                  htmlFor="keepSignedIn"
                  className="ml-2 justify-start font-semibold  text-sm text-gray text-[#1176BC]"
                >
                  Keep me signed in
                </label>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
