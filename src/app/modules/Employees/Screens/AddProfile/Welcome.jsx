import { Link } from "react-router-dom";
import { IoArrowForward } from "react-icons/io5";
import logo from "../../../../../assets/images/tecbrix-logo.png";

const Welcome = () => {
  return (
    <div className="h-screen flex justify-center">
      <div className="w-full flex flex-col min-h-full p-3 md:p-5 lg:p-7">
        <div className="flex justify-between">
          <div className="flex justify-start items-start">
            <img
              src={logo}
              className="w-[142px] h-auto md:h-auto lg:pl-5"
              alt="Tecbrix logo"
            />
          </div>
        </div>
        <div className="flex justify-center items-center flex-grow">
          <div className="md:mx-auto w-full md:max-w-sm">
            <div className="mx-auto">
              <h2 className="text-[#323333] text-center text-2xl md:text-4xl font-lato font-bold leading-9 tracking-tight mb-4">
                Welcome to HR Managment System
              </h2>
            </div>
            <p className="font-roboto text-base text-baseGray font-normal text-center mb-6">
              Let’s Start the Onboarding Process
            </p>
            <Link
              to="/"
              type="submit"
              className={`flex h-10 justify-center items-center w-full font-normal rounded-xl px-3 py-1.5 text-sm md:text-lg leading-8 font-lato lg:text-base bg-black text-white gap-x-4`}
            >
              Start
              <IoArrowForward />
            </Link>
          </div>
        </div>
        <div className="flex justify-start items-start">
          <p className="font-roboto font-normal text-base text-[#5C5E64] lg:pl-5">
            © 2024 TecBrix
          </p>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
