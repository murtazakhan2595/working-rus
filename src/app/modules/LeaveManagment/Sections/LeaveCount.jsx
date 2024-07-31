import React from 'react';

const LeaveCount = ({ title, leaveCount, borderColor, clipPath }) => {
    return (
        <div className="flex flex-col items-center mb-6 md:mb-0">
            <h3 className="text-base font-lato text-baseGray font-medium mb-2">
                {title}
            </h3>
            <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-gray-200 flex items-center justify-center text-2xl font-bold text-gray-600">
                    {leaveCount}
                </div>
                <div
                    className="absolute inset-0 w-32 h-32 rounded-full"
                    style={{ borderColor: borderColor, clipPath: `"${clipPath}"` }}
                ></div>
            </div>
        </div>
    );
};

export default LeaveCount;
