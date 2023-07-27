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

  return (
    <>
      <div
        className="h-screen"
        style={{
          backgroundImage: "url(/login-bg.png)",
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
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
                      placeholder:mx-2   sm:text-sm sm:leading-8 
                      "
                  />
                </div>
              </div>

              <div>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Password"
                    autoComplete="current-password"
                    title="Enter Your Password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-zinc-100 border-l-8 placeholder-style border-cyan-600 block w-full  rounded-md py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-8"
                  />
                </div>
                <div className="text-sm text-right my-2">
                  <a href="#" className="font-semibold  text-cyan-500 hover:text-indigo-300 no-underline">
                    Forgot password?
                  </a>
                </div>
              </div>

              
              <div >
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
