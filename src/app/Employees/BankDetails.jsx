import Joi from 'joi';
import Button from './Button';

const bankSchema = Joi.object({
    bank: Joi.string().required().label('Bank Name'),
    accTitle: Joi.string().required().label('Account Title'),
    accNumber: Joi.string().required().label('Account Number'),
    // iban: Joi.string().required().label('IBAN'),
    branchaddress: Joi.string().required().label('Branch Address'),
    branchcode: Joi.string().required().label('Branch Code'),
});


const BankDetails = ({ formData, errors, setErrors, prevstep, nextstep, handleChange }) => {
    const { bank, accTitle, accNumber, iban, branchaddress, branchcode } = formData;

    const handleNextStep = () => {
        // Validate the form data against the schema
        const { error } = bankSchema.validate(
            {
                bank: bank,
                accTitle: accTitle,
                accNumber: accNumber,
                // iban: iban,
                branchaddress: branchaddress,
                branchcode: branchcode,
            },
            { abortEarly: false }
        );

        if (error) {
            const validationErrors = {};
            error.details.forEach((detail) => {
                validationErrors[detail.path[0]] = detail.message;;
            });
            setErrors(validationErrors);
            console.log(validationErrors)
        } else {
            // Proceed to the next step
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
                                    <input type="text" value={bank} name="bank" id="" placeholder='Bank Name Here'
                                        className='pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50'
                                        onChange={(e) => handleChange(e.target.name, e.target.value)}
                                    />
                                    {errors.bank && <div className="text-red-500 text-sm">{errors.bank}</div>}

                                </div>
                                <div className='flex flex-col mt-2 md:mt-5 md:w-1/2'>
                                    <label htmlFor="accTitle" className='font-sfpro tracking-wide font-medium
                            text-input text-base mb-1'>Account Title:</label>
                                    <input type="text" value={accTitle} name="accTitle" id="" placeholder='Account Title Here'
                                        className='pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50'
                                        onChange={(e) => handleChange(e.target.name, e.target.value)}
                                    />
                                    {errors.accTitle && <div className="text-red-500 text-sm">{errors.accTitle}</div>}
                                </div>
                            </div>
                            <div className="flex flex-col md:flex-row md:gap-x-3 lg:gap-x-12">
                                <div className='flex flex-col mt-2 md:mt-5 md:w-1/2'>
                                    <label htmlFor="accNumber" className='font-sfpro tracking-wide font-medium
                            text-input text-base mb-1'>Account Number:</label>
                                    <input type="number" value={accNumber} name="accNumber" id="" placeholder='Account Number Here'
                                        className='pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50'
                                        onChange={(e) => handleChange(e.target.name, e.target.value)}
                                    />
                                    {errors.accNumber && <div className="text-red-500 text-sm">{errors.accNumber}</div>}
                                </div>
                                <div className='flex flex-col mt-2 md:mt-5 md:w-1/2'>
                                    <label htmlFor="iban" className='font-sfpro tracking-wide font-medium
                            text-input text-base mb-1'>IBAN Number:</label>
                                    <input type="text" value={iban} name="iban" id="" placeholder='IBAN Here'
                                        className='pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50'
                                        onChange={(e) => handleChange(e.target.name, e.target.value)}
                                    />
                                    {errors.iban && <div className="text-red-500 text-sm">{errors.iban}</div>}
                                </div>
                            </div>
                            <div className='flex flex-col mt-2 md:mt-5'>
                                <label htmlFor="branchaddress" className='font-sfpro tracking-wide font-medium
                            text-input text-base mb-1'>Branch Address:</label>
                                <input type="text" value={branchaddress} name="branchaddress" id="" placeholder='Branch Address Here'
                                    className='pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50'
                                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                                />
                                {errors.branchaddress && <div className="text-red-500 text-sm">{errors.branchaddress}</div>}
                            </div>
                            <div className='flex flex-col mt-2 md:mt-5 w-1/2 lg:w-1/3'>
                                <label htmlFor="branchcode" className='font-sfpro tracking-wide font-medium
                            text-input text-base mb-1'>Branch Code:</label>
                                <input type="number" value={branchcode} name="branchcode" id="" placeholder='Branch Code Here'
                                    className='pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50'
                                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                                />
                                {errors.branchcode && <div className="text-red-500 text-sm">{errors.branchcode}</div>}
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