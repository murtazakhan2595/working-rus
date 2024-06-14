/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { connect } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { RiArrowDownSFill } from "react-icons/ri";
import Cookies from "universal-cookie";
import { setUserLogout } from "../../../state/actions/UserAction";
import { setSidebarRefresh } from "../../../state/actions/UserAction";

const PageHeader = ({
    userProfile,
    title
}) => {
    const cookies = new Cookies();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();

    // logout dropdown
    const handleDropdownClick = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    // handle logout
    const handleLogout = () => {
        window.localStorage.setItem("token","")
        setUserLogout();
        navigate("/login");
    };

    return (
        <div className="py-5 pl-10 pr-2 flex gap-3 items-center justify-between w-full">
            <div className="flex items-center">
                <h1 className="text-3xl mr-2 leading-none font-semibold opacity-80 tracking-widest">
                    <Link>{title}</Link>
                </h1>
            </div>
            <div className="relative">
                <div
                    className="flex py-2 justify-end px-5 items-center gap-3 rounded-lg bg-gray-200 cursor-pointer"
                    onClick={handleDropdownClick}
                >
                    <div className="text-3xl w-8 h-8 rounded-full border bg-white"></div>
                    <div className="text-[#283b91]">{userProfile.username}</div>
                    <div className="text-[#283b91]">
                        <RiArrowDownSFill />
                    </div>
                </div>
                {isDropdownOpen && (
                    <div className="absolute right-0 mt-1 w-48 bg-[#283b91] border rounded-lg shadow-lg">
                        <button
                            className="block w-full py-2 px-4 text-left hover:bg-gray-100 hover:text-[#283b91] text-white"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        userProfile: state.user.userProfile,
    };
};

export default connect(mapStateToProps, { setSidebarRefresh })(PageHeader);
