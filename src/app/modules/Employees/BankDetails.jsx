import Joi from 'joi';
import Button from './Button';
import { useState, useEffect } from 'react';

import { connect } from "react-redux";
import { getEmployeeBankDetailsData, saveEmployeeBankDetailsData } from '../../hooks/employee';
import { EmployeeBankDetails } from '../../utils/Types/Employee'
import { validationBankDetailsFormSchema } from '../../utils/FormSchema/employeeFormSchema'

const BankDetails = ({ errors, setErrors, prevstep, nextstep, userProfile, baseUrl, token }) => {

    const [bankInfo, setBankInfo] = useState({})
    useEffect(() => {
        getEmployeeBankDetailsData(baseUrl, userProfile?.id, token).then(response => {
            setBankInfo(response);
        }).catch(error => {
            console.log(error);
        });
    }, [baseUrl, userProfile, token]); // Empty dependency array ensures this effect runs only once after the initial render

    const handleChange = (name, value) => {
        setBankInfo({ ...bankInfo, [name]: value })
        setErrors({ ...errors, [name]: null });
    };

    const handleNextStep = () => {
        const { error } = validationBankDetailsFormSchema.validate(
            {
                bank_name: bankInfo.bank_name,
                account_title: bankInfo.account_title,
                account_number: bankInfo.account_number,
                branch_address: bankInfo.branch_address,
                branch_code: bankInfo.branch_code,
                swift_code: bankInfo.swift_code,
            },
            { abortEarly: false }
        );

        if (error) {
            const validationErrors = {};
            error.details.forEach((detail) => {
                validationErrors[detail.path[0]] = detail.message;;
            });
            if (bankInfo.account_iban) {
                if (bankInfo.account_iban.length < 10)
                    validationErrors.account_iban = "IBAN number must be at least 10 characters";
            }
            setErrors(validationErrors);
        } else {
            if (bankInfo && !bankInfo?.account_iban) {
                delete bankInfo.account_iban;
            }
            if (bankInfo && !bankInfo?.swift_code) {
                delete bankInfo.swift_code;
            }
            saveEmployeeBankDetailsData(baseUrl, userProfile?.id, token, bankInfo);
            nextstep();
        }
    };

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
                                    <input type="text" value={bankInfo.bank_name} name="bank_name" id="" placeholder='Bank Name Here'
                                        className='pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50'
                                        onChange={(e) => handleChange(e.target.name, e.target.value)}
                                    />
                                    {errors.bank_name && <div className="text-red-500 text-sm">{errors.bank_name}</div>}

                                </div>
                                <div className='flex flex-col mt-2 md:mt-5 md:w-1/2'>
                                    <label htmlFor="account_title" className='font-sfpro tracking-wide font-medium
                            text-input text-base mb-1'>Account Title:</label>
                                    <input type="text" value={bankInfo.account_title} name="account_title" id="" placeholder='Account Title Here'
                                        className='pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50'
                                        onChange={(e) => handleChange(e.target.name, e.target.value)}
                                    />
                                    {errors.account_title && <div className="text-red-500 text-sm">{errors.account_title}</div>}
                                </div>
                            </div>
                            <div className="flex flex-col md:flex-row md:gap-x-3 lg:gap-x-12">
                                <div className='flex flex-col mt-2 md:mt-5 md:w-1/2'>
                                    <label htmlFor="account_number" className='font-sfpro tracking-wide font-medium
                            text-input text-base mb-1'>Account Number:</label>
                                    <input type="number" value={bankInfo.account_number} name="account_number" id="" placeholder='Account Number Here'
                                        className='pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50'
                                        onChange={(e) => handleChange(e.target.name, e.target.value)}
                                    />
                                    {errors.account_number && <div className="text-red-500 text-sm">{errors.account_number}</div>}
                                </div>
                                <div className='flex flex-col mt-2 md:mt-5 md:w-1/2'>
                                    <label htmlFor="account_iban" className='font-sfpro tracking-wide font-medium
                            text-input text-base mb-1'>IBAN Number:</label>
                                    <input type="text" value={bankInfo.account_iban} name="account_iban" id="" placeholder='IBAN Here'
                                        className='pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50'
                                        onChange={(e) => handleChange(e.target.name, e.target.value)}
                                    />
                                    {errors.account_iban && <div className="text-red-500 text-sm">{errors.account_iban}</div>}
                                </div>
                            </div>
                            <div className='flex flex-col mt-2 md:mt-5'>
                                <label htmlFor="branch_address" className='font-sfpro tracking-wide font-medium
                            text-input text-base mb-1'>Branch Address:</label>
                                <input type="text" value={bankInfo.branch_address} name="branch_address" id="" placeholder='Branch Address Here'
                                    className='pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50'
                                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                                />
                                {errors.branch_address && <div className="text-red-500 text-sm">{errors.branch_address}</div>}
                            </div>
                            <div className='flex flex-col md:flex-row md:gap-x-3 lg:gap-x-12'>
                                <div className='flex flex-col  mt-2 md:mt-5 w-1/2 lg:w-1/3'>
                                    <label htmlFor="branch_code" className='font-sfpro tracking-wide font-medium
                            text-input text-base mb-1'>Branch Code:</label>
                                    <input type="number" value={bankInfo.branch_code} name="branch_code" id="" placeholder='Branch Code Here'
                                        className='pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50'
                                        onChange={(e) => handleChange(e.target.name, e.target.value)}
                                    />
                                    {errors.branch_code && <div className="text-red-500 text-sm">{errors.branch_code}</div>}
                                </div>
                                <div className='flex flex-col mt-2 md:mt-5 w-1/2 lg:w-1/3'>
                                    <label htmlFor="swift_code" className='font-sfpro tracking-wide font-medium
                            text-input text-base mb-1'>Swift Code:</label>
                                    <input type="text" value={bankInfo.swift_code} name="swift_code" id="" placeholder='Swift Code Here'
                                        className='pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50'
                                        onChange={(e) => handleChange(e.target.name, e.target.value)}
                                    />
                                    {errors.swift_code && <div className="text-red-500 text-sm">{errors.swift_code}</div>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-x-20 mt-6 lg:mt-10 md:mt-0 mb-40 lg:mb-40">
                    <Button onClick={prevstep} text={'Previous'} />
                    <Button onClick={handleNextStep} text={'Next'} />
                </div>
            </div >
        </div>
    )
}



const mapStateToProps = (state) => {
    return {
        userProfile: state.user.userProfile,
        token: state.user.token,
        baseUrl: state.user.baseUrl,
    };
};

export default connect(mapStateToProps)(BankDetails);
