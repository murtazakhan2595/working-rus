import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ForgotPassword = () => {
    const baseUrl = useSelector((state) => state.user.baseUrl);
    const initialData = { email: "" };

    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState(initialData);
    const [response, setResponse] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await axios.post(`${baseUrl}/password/reset/`, formData);
            if (res.status === 200) {
                setResponse({ message: res.data.success, status: "success" });
            }
        } catch (error) {
            setResponse({ message: error.response?.data?.error || "An error occurred", status: "error" });
        } finally {
            setIsLoading(false);
            setFormData(initialData);
        }
    };

    return (
        <div className="h-screen flex justify-center p-3 md:p-5 lg:p-7">
            <div className="w-full md:w-2/3 flex flex-col min-h-full">
                <div className="flex justify-center items-center flex-grow">
                    <div className="md:mx-auto w-full max-w-md lg:max-w-xl">
                        <form
                            className="space-y-3 my-2 lg:py-10 md:py-6 md:px-8 md:m-6"
                            onSubmit={handleSubmit}
                            method="POST"
                        >
                            <div className="mx-auto">
                                <h2 className="text-[#323333] text-center text-2xl lg:text-4xl font-lato font-bold leading-9 pb-4 tracking-tight">
                                    Enter Your Email
                                </h2>
                            </div>

                            <div className="relative">
                                <label
                                    htmlFor="email"
                                    className="text-[#323333] font-normal font-lato text-base"
                                >
                                    Email*
                                </label>
                                <input
                                    required
                                    name="email"
                                    type="email"
                                    title="Enter Your Email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full rounded-xl py-2 my-1 h-11 text-gray-900 border border-[#969799] pl-2 md:text-base text-sm sm:leading-8 focus:outline-none font-lato"
                                />
                            </div>

                            {response && (
                                <div className={`mx-auto p-2 flex gap-x-2 rounded-xl ${response.status === "success" ? "bg-[#E6FFEA] border border-[#B6F2C2]" : "bg-[#FFF8F7] border border-[#F2DCDA]"}`}>
                                    <p className={`font-lato text-[14px] ${response.status === "success" ? "text-[#27A745]" : "text-[#F08278]"}`}>
                                        {response.message}
                                    </p>
                                </div>
                            )}

                            <div className="flex items-center gap-x-4">
                                <button
                                    type="submit"
                                    className={`flex h-11 justify-center items-center w-full font-normal rounded-xl px-3 py-1.5 text-sm md:text-lg leading-8 font-lato lg:text-base ${isLoading ? "bg-[#F2F2F2] text-[#AFB0B2]" : "bg-black text-white"}`}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <span className="animate-pulse">Sending Link...</span>
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

export default ForgotPassword;
