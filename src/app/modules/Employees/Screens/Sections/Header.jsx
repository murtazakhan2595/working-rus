// Header.js
import React from "react";

const Header = ({ userProfile, title, onSearch }) => {
    return (
        <>
            <div className="py-5 pl-10 pr-2 flex gap-3 flex-col-reverse items-center md:flex-row lg:flex-row justify-between w-full">
                <div className="flex items-center">
                    <h1 className="text-xl lg:text-3xl mr-2 items-center leading-none font-semibold opacity-80 tracking-widest">
                        {title}
                    </h1>

                </div>
            </div>
        </>
    );
};


export default Header;
