// Header.js
import React from "react";

const Header = ({ title, content }) => {
    return (
        <>
            <div className="flex px-4 py-4 justify-content-between">
                <div className="">
                    <h4 className="fw-700">
                        {title}
                    </h4>
                </div>
                <div className="">
                    {content}
                </div>
            </div>
        </>
    );
};


export default Header;
