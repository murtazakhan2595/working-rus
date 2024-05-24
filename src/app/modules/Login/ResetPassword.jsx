import React, { useState, useEffect } from "react";
import { IoWarningOutline } from "react-icons/io5";
import logo from "../.././../assets/images/tecbrix-logo.png";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { BiShow } from "react-icons/bi";
import { TbEyeClosed } from "react-icons/tb";

const ResetPassword = () => {
    const baseUrl = useSelector((state) => state.user.baseUrl);

    const initialData = { password: "", retype_password: "" };

    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState(initialData);
    const [passwordVisibility, setPasswordVisibility] = useState({
        password: false,
        retype_password: false,
    });
    const [errorMessage, setErrorMessage] = useState("");
    const [isFormValid, setIsFormValid] = useState(false);

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
        // console.log(formData);
        console.log({ "password": formData.password });
        setFormData(initialData);
    };

    return (
        <div className="h-screen flex justify-center p-3 md:p-5 lg:p-7">
            <div className="w-full md:w-2/3 flex flex-col min-h-full">
                <div className="flex justify-start items-start">
                    <img
                        src={logo}
                        className="w-[142px] h-auto md:h-auto lg:pl-5"
                        alt="Tecbrix logo"
                    />
                </div>
                <div className="flex justify-center items-center flex-grow">
                    <div className="md:mx-auto w-full max-w-md lg:max-w-xl">
                        <form
                            className="space-y-3 my-2 lg:py-10 md:py-6 md:px-8 md:m-6"
                            onSubmit={handleSubmit}
                            method="POST"
                        >
                            <div className="mx-auto">
                                <h2 className="text-[#323333] text-center text-2xl lg:text-4xl font-lato font-bold leading-9 pb-4 tracking-tight">
                                    Enter New Password
                                </h2>
                            </div>

                            <div className="mx-auto bg-[#FFF8F7] border border-[#F2DCDA] rounded-xl px-2 py-4 flex gap-x-2">
                                <div>
                                    <IoWarningOutline className="text-[#F08278] text-lg" />
                                </div>
                                <p className="font-lato text-[#5C5E64] text-[14px]">
                                    Your new password must not be the same or contain the same password as your previous ones.
                                </p>
                            </div>

                            <div className="relative">
                                <label
                                    htmlFor="password"
                                    className="text-[#323333] font-normal font-lato text-base"
                                >
                                    New Password*
                                </label>
                                <input
                                    required
                                    name="password"
                                    type={passwordVisibility.password ? "text" : "password"}
                                    title="Enter Your Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full rounded-xl py-2 my-1 h-11 text-gray-900 border border-[#969799] pl-2 md:text-base text-sm sm:leading-8 focus:outline-none font-lato"
                                />
                                <button
                                    type="button"
                                    onClick={() => handlePasswordVisibility("password")}
                                    className={`absolute inset-y-12 right-2 flex items-center ${passwordVisibility.password ? "text-gray-400" : ""}`}
                                >
                                    {passwordVisibility.password ? (
                                        <BiShow className="text-gray-400" />
                                    ) : (
                                        <TbEyeClosed className="text-gray-400" />
                                    )}
                                </button>
                            </div>

                            <div className="relative">
                                <label
                                    htmlFor="retype_password"
                                    className="text-[#323333] font-normal font-lato text-base"
                                >
                                    Retype New Password*
                                </label>
                                <input
                                    required
                                    name="retype_password"
                                    type={passwordVisibility.retype_password ? "text" : "password"}
                                    title="Retype your password"
                                    value={formData.retype_password}
                                    onChange={handleChange}
                                    className="w-full rounded-xl py-2 my-1 h-11 text-gray-900 border border-[#969799] pl-2 md:text-base text-sm sm:leading-8 focus:outline-none font-lato"
                                />
                                <button
                                    type="button"
                                    onClick={() => handlePasswordVisibility("retype_password")}
                                    className={`absolute inset-y-12 right-2 flex items-center ${passwordVisibility.retype_password ? "text-gray-400" : ""}`}
                                >
                                    {passwordVisibility.retype_password ? (
                                        <BiShow className="text-gray-400" />
                                    ) : (
                                        <TbEyeClosed className="text-gray-400" />
                                    )}
                                </button>
                            </div>

                            {errorMessage && (
                                <div className="mx-auto bg-[#FFF8F7] border border-[#F2DCDA] rounded-xl p-2 flex gap-x-2">
                                    <p className="font-lato text-[#F08278] text-[14px]">
                                        {errorMessage}
                                    </p>
                                </div>
                            )}

                            <div className="flex items-center gap-x-4">
                                <button
                                    type="submit"
                                    className={`flex h-11 justify-center items-center w-full font-normal rounded-xl  px-3 py-1.5 text-sm md:text-lg leading-8 font-lato lg:text-base ${!isFormValid ? "bg-[#F2F2F2] text-[#AFB0B2]" : "bg-black text-white"}`}
                                    disabled={isLoading || !isFormValid}
                                >
                                    {isLoading ? (
                                        <span className="animate-pulse">Resetting...</span>
                                    ) : (
                                        <span>Reset Password</span>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="flex justify-start items-start">
                    <p className="font-roboto font-normal text-base text-[#5C5E64] lg:pl-5">
                        © 2024 TecBrix
                    </p>
                </div>
            </div>

            <div className="w-0 md:w-1/3 h-full bg-gray-500 rounded-xl">
                {/* This div is for the banner image on the right side */}
            </div>
        </div>
    );
};

export default ResetPassword;
