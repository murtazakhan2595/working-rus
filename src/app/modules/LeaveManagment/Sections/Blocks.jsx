import React from 'react'

const Block = ({ icon, count, label }) => {
    return (
        <div className="flex items-center justify-between bg-white px-4 py-6 rounded-lg shadow-md">
            <div className="flex justify-between w-full gap-x-3">
                <img src={icon} alt="" />
                <div>
                    <div className="text-4xl font-bold text-center text-[#323333]">{count}</div>
                    <div className="text-baseGray font-lato text-lg">{label}</div>
                </div>
            </div>
        </div>
    )
}

export default Block;


