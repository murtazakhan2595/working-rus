import React from 'react'

const Department = ({ formData, prevstep, handleChange, submitForm }) => {
    const { department, position, directrpt, indirectrpt, dptmanager } = formData;
    return (
        <>
            <div className='bg-[#F9F9F9] h-screen overflow-y-auto overflow-x-hidden scroll px-3 md:px-6 lg:px-10'>
                <h2 className='text-baseBlue tracking-wide mb-2 lg:mb-4 lg:text-lg mt-2'>Department Information:</h2>
                <div className='flex flex-col md:flex-row lg:gap-x-36'>
                    <div className='order-2 md:order-1 md:w-[55%]'>
                        <div className="flex flex-col">
                            <div className="flex flex-col md:flex-row md:gap-x-3 lg:gap-x-12">
                                <div className='flex flex-col mt-2 md:mt-5 md:w-1/2'>
                                    <label htmlFor="department" className='font-sfpro tracking-wide font-medium
                            text-input text-base mb-1'>Department Name:</label>
                                    <input type="text" value={department} name="department" id="" placeholder='Department Name Here'
                                        className='pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50'
                                        onChange={(e) => handleChange(e.target.name, e.target.value)}
                                    />
                                </div>
                                <div className='flex flex-col mt-2 md:mt-5 md:w-1/2'>
                                    <label htmlFor="position" className='font-sfpro tracking-wide font-medium
                            text-input text-base mb-1'>Position:</label>
                                    <input type="text" value={position} name="position" id="" placeholder='Position Here'
                                        className='pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50'
                                        onChange={(e) => handleChange(e.target.name, e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col md:flex-row md:gap-x-3 lg:gap-x-12">
                                <div className='flex flex-col mt-2 md:mt-5 md:w-1/2'>
                                    <label htmlFor="directrpt" className='font-sfpro tracking-wide font-medium
                            text-input text-base mb-1'>Direct Report:</label>
                                    <input type="text" value={directrpt} name="directrpt" id="" placeholder='Direct Report Here'
                                        className='pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50'
                                        onChange={(e) => handleChange(e.target.name, e.target.value)}
                                    />
                                </div>
                                <div className='flex flex-col mt-2 md:mt-5 md:w-1/2'>
                                    <label htmlFor="indirectrpt" className='font-sfpro tracking-wide font-medium
                            text-input text-base mb-1'>Indirect Report:</label>
                                    <input type="text" value={indirectrpt} name="indirectrpt" id="" placeholder='Indirect Report Here'
                                        className='pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50'
                                        onChange={(e) => handleChange(e.target.name, e.target.value)}
                                    />
                                </div>

                            </div>

                            <div className="flex flex-col md:flex-row md:gap-x-3 lg:gap-x-12">
                                <div className='flex flex-col mt-2 md:mt-5 md:w-1/2 lg:w-[45.5%]'>
                                    <label htmlFor="dptmanager" className='font-sfpro tracking-wide font-medium
                            text-input text-base mb-1'>Department Manager:</label>
                                    <input type="text" value={dptmanager} name="dptmanager" id="" placeholder='Department Manager Here'
                                        className='pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50'
                                        onChange={(e) => handleChange(e.target.name, e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-x-20 mt-6 lg:mt-10">
                    <button onClick={prevstep} className='bg-baseBlue rounded-lg text-white w-24 py-[3px]
                     mt-5  md:mt-0 mb-40 lg:mb-4'>Previous</button>
                    <button type='submit' className='bg-baseBlue rounded-lg text-white w-24 py-[3px] mt-5
                     md:mt-0 mb-40 lg:mb-4' onClick={submitForm} >Submit</button>

                </div>
            </div >
        </>
    )
}

export default Department