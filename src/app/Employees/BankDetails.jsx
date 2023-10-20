import React from 'react'

const BankDetails = ({ formData, prevstep, nextstep, handleChange }) => {
    const { bank, accTitle, accNumber, iban, branchaddress, branchcode } = formData;
    return (
        <div>
            <div className='bg-[#F9F9F9] h-screen overflow-y-auto overflow-x-hidden scroll px-3 md:px-6 lg:px-10'>
                <h2 className='text-baseBlue tracking-wide mb-2 lg:mb-4 lg:text-lg mt-2'>Bank Details:</h2>
                <div className='flex flex-col md:flex-row lg:gap-x-36'>
                    <div className='order-2 md:order-1 md:w-[50%]'>
                        <div className="flex flex-col">
                            <div className="flex flex-col md:flex-row md:gap-x-3 lg:gap-x-12">
                                <div className='flex flex-col mt-2 md:mt-5 md:w-1/2'>
                                    <label htmlFor="bank" className='font-sfpro tracking-wide font-medium
                            text-input text-base mb-1'>Bank Name:</label>
                                    <input type="text" value={bank} name="bank" id="" placeholder='Bank Name Here'
                                        className='pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50'
                                        onChange={(e) => handleChange(e.target.name, e.target.value)}
                                    />
                                </div>
                                <div className='flex flex-col mt-2 md:mt-5 md:w-1/2'>
                                    <label htmlFor="acctitle" className='font-sfpro tracking-wide font-medium
                            text-input text-base mb-1'>Account Title:</label>
                                    <input type="text" value={accTitle} name="acctitle" id="" placeholder='Account Title Here'
                                        className='pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50'
                                        onChange={(e) => handleChange(e.target.name, e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col md:flex-row md:gap-x-3 lg:gap-x-12">
                                <div className='flex flex-col mt-2 md:mt-5 md:w-1/2'>
                                    <label htmlFor="accnumber" className='font-sfpro tracking-wide font-medium
                            text-input text-base mb-1'>Account Number:</label>
                                    <input type="tel" value={accNumber} name="accnumber" id="" placeholder='Account Number Here'
                                        className='pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50'
                                        onChange={(e) => handleChange(e.target.name, e.target.value)}
                                    />
                                </div>
                                <div className='flex flex-col mt-2 md:mt-5 md:w-1/2'>
                                    <label htmlFor="iban" className='font-sfpro tracking-wide font-medium
                            text-input text-base mb-1'>IBAN Number:</label>
                                    <input type="text" value={iban} name="iban" id="" placeholder='IBAN Here'
                                        className='pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50'
                                        onChange={(e) => handleChange(e.target.name, e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className='flex flex-col mt-2 md:mt-5'>
                                <label htmlFor="branchaddress" className='font-sfpro tracking-wide font-medium
                            text-input text-base mb-1'>Branch Address:</label>
                                <input type="text" value={branchaddress} name="branchaddress" id="" placeholder='Branch Address Here'
                                    className='pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50'
                                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                                />
                            </div>
                            <div className='flex flex-col mt-2 md:mt-5 w-1/2 lg:w-1/3'>
                                <label htmlFor="branchcode" className='font-sfpro tracking-wide font-medium
                            text-input text-base mb-1'>Branch Code:</label>
                                <input type="text" value={branchcode} name="branchcode" id="" placeholder='Branch Code Here'
                                    className='pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50'
                                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-x-20 mt-6 lg:mt-10">
                    <button onClick={prevstep} className='bg-baseBlue rounded-lg text-white w-24 py-[3px] mt-5  md:mt-0 mb-40 lg:mb-4'>Previous</button>
                    <button onClick={nextstep} className='bg-baseBlue rounded-lg text-white w-24 py-[3px] mt-5 md:mt-0 mb-40 lg:mb-4'>Next</button>

                </div>
            </div >
        </div>
    )
}

export default BankDetails