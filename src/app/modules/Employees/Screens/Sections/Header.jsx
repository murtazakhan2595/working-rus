// Header.js
import React from "react";

const Header = ({ title }) => {
    return (
        <>
            <div className="py-4 px-4">
                <h4 className="fw-700">
                    {title}
                </h4>
            </div>
        </>
    );
};


export default Header;
