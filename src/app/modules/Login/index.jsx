import React, { useState } from "react";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("Password:", password);
    setEmail("");
    setPassword("");
  };
  const [showPassword, setShowPassword] = useState(false);

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <div
        className="h-screen"
        style={{
          backgroundImage: "url(/login-bg.png)",
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          overflowY:"hidden"
        }}
      >
        <div>
          <img
            src="./Tecbrix-logo.png"
            className="ml-6 mt-4"
            alt="Tecbrix logo"
          />
          <div className="md:mx-auto sm:mx-auto md:w-fit sm:w-full sm:max-w-lg pt-4 ">
            <form
              className="space-y-3 bg-white my-2 py-16 border border-gray-300 rounded-lg shadow-md p-8 m-8 max-w-800 "
              onSubmit={handleSubmit}
              method="POST"
            >
              <div>
                <h2 className="text-cyan-600 text-center text-2xl font-extrabold leading-9 tracking-tight">
                  Login Account
                </h2>
                <p className="text-center mx-4 text-gray-500">
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-zinc-100 w-full  
                    rounded-md py-1.5 text-gray-900 placeholder-style
                     placeholder:text-gray-400 border-l-8 border-cyan-500
                      placeholder:mx-2 pl-3  sm:text-sm sm:leading-8 
                      "
                  />
                </div>
              </div>

              <div>
                <div className="mt-2 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    autoComplete="current-password"
                    title="Enter Your Password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-zinc-100 w-full rounded-md py-1.5 text-gray-900 placeholder-style placeholder:text-gray-400 border-l-8 border-cyan-500 placeholder:mx-2 pl-3 sm:text-sm sm:leading-8"
                  />
                  <button
                    type="button"
                    onClick={handlePasswordVisibility}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-cyan-500 cursor-pointer"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 3a7 7 0 017 7 6.999 6.999 0 01-2.1 5H12a5 5 0 00-4.8 3.46A5.999 5.999 0 005 10a7 7 0 017-7zm-.1 11H10a3 3 0 001.1-5 3.001 3.001 0 00-2.2-1 3 3 0 002.9 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-cyan-500 cursor-pointer"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9.25 14C5.981 14 3.118 11.681 2 9.5c1.118-2.18 3.98-4.5 7.25-4.5s6.132 2.32 7.25 4.5c-1.118 2.181-3.981 4.5-7.25 4.5zm0-2C7.561 12 5.116 10.07 4 8.5c1.116-1.57 3.561-3.5 5.25-3.5S10.384 6.93 11.5 8.5c-1.116 1.57-3.561 3.5-5.25 3.5zM10 7a1 1 0 110-2 1 1 0 010 2z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>
                </div>

                <div className="text-sm text-right my-2">
                  <a
                    href="#"
                    className="font-semibold  text-cyan-500 hover:text-cyan-900 no-underline"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full mt-4 justify-center rounded-md bg-cyan-600 px-3 py-1.5 text-sm font-semibold 
                leading-8 text-white shadow-sm hover:bg-cyan-900 focus-visible:outline focus-visible:outline-2 
                focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Login
                </button>
              </div>
              <div className="flex   ">
                <input
                  id="keepSignedIn"
                  name="keepSignedIn"
                  type="checkbox"
                  checked={isChecked}
                  onChange={handleCheckboxChange}
                  className=" justify-start w-3 rounded text-cyan-500 focus:ring-indigo-500"
                />
                <label
                  htmlFor="keepSignedIn"
                  className="ml-2 justify-start font-semibold  text-sm text-gray text-cyan-500 "
                >
                  Keep me signed in
                </label>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;