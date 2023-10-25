import Joi from 'joi';
import Button from './Button';

const departmentSchema = Joi.object({
    department: Joi.string().required().label('Department Name'),
    position: Joi.string().required().label('Position'),
    directrpt: Joi.string().required().label('Direct Report'),
    indirectrpt: Joi.string().required().label('Indirect Report'),
    dptmanager: Joi.string().required().label('Department Manager'),
});

const Department = ({ formData, errors, setErrors, prevstep, handleChange, submitForm }) => {
    const { department, position, directrpt, indirectrpt, dptmanager } = formData;

    const handleNextStep = () => {
        // Validate the form data against the schema
        const { error } = departmentSchema.validate(
            {
                department: department,
                position: position,
                directrpt: directrpt,
                indirectrpt: indirectrpt,
                dptmanager: dptmanager,
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
            submitForm();
        }
    };
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
                                    {errors.department && <span className="text-red-500 text-sm ">{errors.department}</span>}

                                </div>
                                <div className='flex flex-col mt-2 md:mt-5 md:w-1/2'>
                                    <label htmlFor="position" className='font-sfpro tracking-wide font-medium
                            text-input text-base mb-1'>Position:</label>
                                    <input type="text" value={position} name="position" id="" placeholder='Position Here'
                                        className='pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50'
                                        onChange={(e) => handleChange(e.target.name, e.target.value)}
                                    />
                                    {errors.position && <span className="text-red-500 text-sm ">{errors.position}</span>}

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
                                    {errors.directrpt && <span className="text-red-500 text-sm ">{errors.directrpt}</span>}

                                </div>
                                <div className='flex flex-col mt-2 md:mt-5 md:w-1/2'>
                                    <label htmlFor="indirectrpt" className='font-sfpro tracking-wide font-medium
                            text-input text-base mb-1'>Indirect Report:</label>
                                    <input type="text" value={indirectrpt} name="indirectrpt" id="" placeholder='Indirect Report Here'
                                        className='pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50'
                                        onChange={(e) => handleChange(e.target.name, e.target.value)}
                                    />
                                    {errors.indirectrpt && <span className="text-red-500 text-sm ">{errors.indirectrpt}</span>}
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
                                    {errors.dptmanager && <span className="text-red-500 text-sm ">{errors.dptmanager}</span>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-x-20 mt-6 lg:mt-10 md:mt-0 mb-40">
                    <Button onClick={prevstep} text={'Previous'} />
                    <Button onClick={handleNextStep} text={'Submit'} />

                </div>
            </div >
        </>
    )
}

export default Department