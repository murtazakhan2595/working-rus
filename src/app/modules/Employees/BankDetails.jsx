import Joi from 'joi';
import Button from './Button';
import { useState, useEffect } from 'react';

const bankSchema = Joi.object({
    bank_name: Joi.string()
        .regex(/^[a-zA-Z\s]+$/) // Only alphabets and spaces allowed
        .required()
        .label("Bank Name")
        .messages({
            "string.empty": `Bank Name is required`,
            "string.pattern.base": `Bank Name must contain only letters and spaces`,
        }),
    account_title: Joi.string()
        .regex(/^[a-zA-Z\s]+$/)
        .required()
        .label("Account Title")
        .messages({
            "string.empty": `Account Title is required`,
            "string.pattern.base": `Account Title must contain only letters and spaces`,
        }),
    account_number: Joi.string()
        .regex(/^\d+$/) // Only numbers allowed
        .min(10) // Minimum length 10 digits
        .required()
        .label("Account Number")
        .messages({
            "string.empty": `Account Number is required`,
            "string.pattern.base": `Account Number must contain only numbers`,
            "string.min": `Account Number must be at least 10 digits long`,
        }),
    branch_address: Joi.string()
        // .min(10) // Minimum length 10 characters
        .required()
        .label("Branch Address")
        .messages({
            "string.empty": `Branch Address is required`,
            "string.min": `Branch Address must be at least 10 characters long`,
        }),
    branch_code: Joi.string()
        .regex(/^\d+$/) // Only numbers allowed
        .min(3) // Minimum length 3 digits
        .required()
        .label("Branch Code")
        .messages({
            "string.empty": `Branch Code is required`,
            "string.pattern.base": `Branch Code must contain only numbers`,
            "string.min": `Branch Code must be at least 3 digits long`,
        }),
    swift_code: Joi.string()
        .alphanum() // Allow alphanumeric characters
        .min(4) // Assuming a minimum length for Swift code
        .required()
        .label("Swift Code")
        .messages({
            "string.empty": `Swift Code is required`,
            "string.alphanum": `Swift Code must contain only letters and numbers`,
        }),
});


const BankDetails = ({ errors, setErrors, prevstep, nextstep,setBankInfoProps }) => {
    const getDataFromSessionStorage = (key) => {
        const serializedData = sessionStorage.getItem(key);
        const data = JSON.parse(serializedData);
        return data;
    };
    let defaultBankInfo = getDataFromSessionStorage("bankInfo")
    const intialBankInfo = {
        bank_name: defaultBankInfo?.bank_name ? defaultBankInfo.bank_name : '',
        account_title: defaultBankInfo?.account_title ? defaultBankInfo.account_title : '',
        account_number: defaultBankInfo?.account_number ? defaultBankInfo.account_number : '',
        account_iban: defaultBankInfo?.account_iban ? defaultBankInfo.account_iban : '',
        branch_address: defaultBankInfo?.branch_address ? defaultBankInfo.branch_address : '',
        branch_code: defaultBankInfo?.branch_code ? defaultBankInfo.branch_code : '',
        swift_code: defaultBankInfo?.swift_code ? defaultBankInfo.swift_code : ''
    };
    const [bankInfo, setBankInfo] = useState(intialBankInfo)

    const setDataInSessionStorage = (key, data) => {
        const serializedData = JSON.stringify(data);
        sessionStorage.setItem(key, serializedData);
    };

    const handleChange = (name, value) => {
        setBankInfo({ ...bankInfo, [name]: value })
        setErrors({ ...errors, [name]: null });
    };

    // useEffect(() => {
    //     setDataInSessionStorage('bankInfo', bankInfo)
    // }, [bankInfo])

    const handleNextStep = () => {
        const { error } = bankSchema.validate(
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
            setBankInfoProps(bankInfo)
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

export default BankDetails