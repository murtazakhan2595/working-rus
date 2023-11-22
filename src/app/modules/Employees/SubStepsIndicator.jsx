import React from 'react'

const SubStepsIndicator = ({ substep }) => {
    return (
        <div className='flex items-center'>
            <div className={`w-3 h-3 rounded-full ${substep === 1 ? 'bg-[#3B82F6]' : ''} mr-1 border`}></div>
            <div className={`w-3 h-3 rounded-full ${substep === 2 ? 'bg-[#3B82F6]' : ''} border`}></div>
        </div>
    )
}

export default SubStepsIndicator