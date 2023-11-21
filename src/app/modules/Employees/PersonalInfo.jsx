import React, { useState , useEffect } from 'react'
import moment from 'moment';
import Datepicker from '../Dashboard/Datepicker';
import upload from '../../../assets/images/upload.png';
import Joi from 'joi';
import Button from './Button';

const validationSchema = Joi.object({
    first_name: Joi.string().min(3).max(20).required().label('First Name'),
    last_name: Joi.string().min(3).max(20).required().label('Last Name'),
    father_name: Joi.string().min(3).max(20).required().label('Father Name'),
    mother_name: Joi.string().min(3).max(20).required().label('Mother Name'),
    country_code: Joi.string().max(4).required().label('Country Code'),
    mobile_no: Joi.string().required().label('Phone Number'),
    date_of_birth: Joi.string().required().label("DOB"),
    email: Joi.string().email({ tlds: { allow: false } }).required().label('Personal Email'),
    work_email: Joi.string().email({ tlds: { allow: false } }).required().label('Work Email'),
    current_address: Joi.string().required().label('Current Address'),
    residential_address: Joi.string().required().label('Permanent Address'),
    nic: Joi.string().required().label('NIC'),
    emergency_first_name: Joi.string().min(3).max(20).required().label("First Name"),
    emergency_last_name: Joi.string().min(3).max(20).required().label("Last Name"),
    emergency_country_code: Joi.string().required().label("Country Code"),
    emergency_phone_no: Joi.string().required().label("Phone Number"),
    relation: Joi.string().required().label("Relation"),
});


const PersonalInfo = ({ nextstep, errors, setErrors }) => {
    const getDataFromSessionStorage = (key) => {
        const serializedData = sessionStorage.getItem(key);
        const data = JSON.parse(serializedData);
        return data;
    };
    const setDataInSessionStorage = (key,data) => {
        const serializedData = JSON.stringify(data);
        sessionStorage.setItem(key, serializedData);
    };
    let storedData = getDataFromSessionStorage('personalInfo')
    let [personalInfo , setPersonalInfo] =useState({
        first_name: storedData?.first_name ? storedData.first_name : "",
        last_name: storedData?.last_name ? storedData.last_name : "",
        father_name: storedData?.father_name ? storedData.father_name : "",
        mother_name: storedData?.mother_name ? storedData.mother_name : "",
        country_code: storedData?.mobile_no ? storedData.country_code : "",
        mobile_no: storedData?.mobile_no ? storedData.mobile_no : "",
        date_of_birth: storedData?.date_of_birth ? storedData.date_of_birth : "",
        email: storedData?.email ? storedData.email : "",
        work_email: storedData?.work_email ? storedData.work_email : "",
        current_address: storedData?.current_address ? storedData.current_address : "",
        residential_address: storedData?.residential_address ? storedData.residential_address : "",
        nic: storedData?.nic ? storedData.nic : "",
        passport_number: storedData?.passport_number ? storedData.passport_number : "",
        emergency_first_name: storedData?.emergency_first_name ? storedData.emergency_first_name : "",
        emergency_last_name: storedData?.emergency_last_name ? storedData.emergency_last_name : "",
        emergency_country_code: storedData?.emergency_country_code ? storedData.emergency_country_code : "",
        emergency_phone_no: storedData?.emergency_phone_no ? storedData.emergency_phone_no : "",
        relation: storedData?.relation ? storedData.relation : "",
    })


    const handleChange = (name, value) => {
        setPersonalInfo({...personalInfo,[name]:value})
            setErrors({ ...errors, [name]: null });
       
    };



    const [imagePreview, setImagePreview] = useState(getDataFromSessionStorage('profilePhoto'));

    const handleImageUpload = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result)
            }
            reader.readAsDataURL(selectedFile);
            const imageError = { image: '' };
            setErrors(imageError);
        }
    }

    useEffect(() => {
        setDataInSessionStorage('personalInfo',personalInfo)
      }, [personalInfo])
    useEffect(() => {
        setDataInSessionStorage("profilePhoto",imagePreview)
    }, [imagePreview])
    
    const handledate_of_birthChange = (date) => {
        const formattedDate = moment(date).format("DD-MM-YYYY").toLowerCase();
        handleChange('date_of_birth', formattedDate);
    };

    const handleNextStep = () => {
        let checkData = getDataFromSessionStorage("personalInfo")
        const copyCheckData = { ...checkData };
        const removePassportValidity = 'passport_number';
        delete copyCheckData[removePassportValidity];
        const { error } = validationSchema.validate(copyCheckData, { abortEarly: false });
        if (error) {
            const validationErrors = {};
            error.details.forEach((detail) => {
                validationErrors[detail.path[0]] = detail.message;
            });
            setErrors(validationErrors);
        } else if (!imagePreview) {
            const imageError = { image: 'Please upload an image.' };
            setErrors(imageError);
        } else {
            setErrors({});
            nextstep();
            console.log("Proceeding to the next step...");
        }
    };


    return (
        <>
            <div className='bg-[#F9F9F9] h-screen overflow-y-auto overflow-x-hidden scroll px-3 md:px-6 lg:px-10'>
                <h2 className='text-baseBlue tracking-wide mb-4 lg:text-lg'>Personal Information:</h2>
                <div className='flex flex-col md:flex-row lg:gap-x-36'>
                    <div className='order-2 md:order-1 md:w-[65%]'>
                        <div className="flex flex-col md:flex-row md:gap-x-3 lg:gap-x-12">
                            <div className='flex flex-col mt-2 md:w-1/2'>
                                <label htmlFor="first_name" className='font-sfpro tracking-wide font-medium
                            text-input text-base mb-1'>First Name:</label>
                                <input type="text" value={personalInfo.first_name} name="first_name" id="" placeholder='First Name here'
                                    className='pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50'
                                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                                />
                                {errors.first_name && <span className="text-red-500 text-sm ">{errors.first_name}</span>}
                            </div>
                            <div className='flex flex-col mt-2 md:w-1/2'>
                                <label htmlFor="last_name" className='font-sfpro tracking-wide font-medium
                            text-input text-base mb-1'>Last Name:</label>
                                <input type="text" value={personalInfo.last_name} name="last_name" id="" placeholder='Last Name here'
                                    className='pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50'
                                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                                />
                                {errors.last_name && <span className="text-red-500 text-sm ">{errors.last_name}</span>}
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row md:gap-x-3 lg:gap-x-12">
                            <div className='flex flex-col mt-2 md:mt-5 md:w-1/2'>
                                <label htmlFor="father_name" className='font-sfpro tracking-wide font-medium
                            text-input text-base mb-1'>Father Name:</label>
                                <input type="text" value={personalInfo.father_name} name="father_name" id="" placeholder='Father Name here'
                                    className='pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50'
                                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                                />
                                {errors.father_name && <span className="text-red-500 text-sm ">{errors.father_name}</span>}
                            </div>
                            <div className='flex flex-col mt-2 md:mt-5 md:w-1/2'>
                                <label htmlFor="mother_name" className='font-sfpro tracking-wide font-medium
                            text-input text-base mb-1'>Mother Name:</label>
                                <input type="text" value={personalInfo.mother_name} name="mother_name" id="" placeholder='Mother Name here'
                                    className='pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50'
                                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                                />
                                {errors.mother_name && <span className="text-red-500 text-sm ">{errors.mother_name}</span>}
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row md:gap-x-3 lg:gap-x-12">
                            <div className='flex flex-col mt-2 md:mt-5 md:w-1/2 '>
                                <label htmlFor="mobile_no" className='font-sfpro tracking-wide font-medium
                            text-input text-base mb-1'>Phone Number:</label>
                            <div className='flex gap-1'>
                                <input type="tel" value={personalInfo.country_code} name="country_code" maxLength={4} id="" placeholder='+1'
                                    className='pl-1 bg-white rounded-l h-8 w-[12%] text-sm placeholder-[#555657] placeholder-opacity-50'
                                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                                />

                                <input type="number" value={personalInfo.mobile_no} name="mobile_no" id="" placeholder='0000000000'
                                    className='pl-2 bg-white rounded-r h-8 w-[87%] text-sm placeholder-[#555657] placeholder-opacity-50'
                                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                                    />
                                    </div>
                                {errors.country_code &&<> <span className="text-red-500 text-sm ">{errors.country_code}</span></>}
                                
                                {errors.mobile_no &&<> <span className="text-red-500 text-sm ">{errors.mobile_no}</span></>}
                            </div>
                            <div className='flex flex-col mt-2 md:mt-5 md:w-1/2'>
                                <label htmlFor="date_of_birth" className='font-sfpro tracking-wide font-medium
                            text-input text-base mb-1'>Date Of Birth:</label>
                                <Datepicker
                                    day={personalInfo.date_of_birth ? personalInfo.date_of_birth.substr(0, 2) : null}
                                    month={personalInfo.date_of_birth ? personalInfo.date_of_birth.substr(3, 2) : null}
                                    year={personalInfo.date_of_birth ? personalInfo.date_of_birth.substr(6, 4) : null}
                                    name="date_of_birth"
                                    className="z-50"
                                    selected={moment(personalInfo.date_of_birth, "DD-MM-YYYY").toDate()}
                                    onChange={handledate_of_birthChange}
                                />
                                {errors.date_of_birth && <span className="text-red-500 text-sm ">{errors.date_of_birth}</span>}
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row md:gap-x-3 lg:gap-x-12">
                            <div className='flex flex-col mt-2 md:mt-5 md:w-1/2'>
                                <label htmlFor="email" className='font-sfpro tracking-wide font-medium
                            text-input text-base mb-1'>Personal Email:</label>
                                <input type="email" value={personalInfo.email} name="email" placeholder='Email Here'
                                    className='pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50'
                                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                                />
                                {errors.email && <span className="text-red-500 text-sm ">{errors.email}</span>}
                            </div>
                            <div className='flex flex-col mt-2 md:mt-5 md:w-1/2'>
                                <label htmlFor="work_email" className='font-sfpro tracking-wide font-medium
                            text-input text-base mb-1'>Work Email:</label>
                                <input type="email" value={personalInfo.work_email} name="work_email" id="" placeholder='Email Here'
                                    className='pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50'
                                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                                />
                                {errors.work_email && <span className="text-red-500 text-sm ">{errors.work_email}</span>}

                            </div>
                        </div>
                        <div className='flex flex-col mt-2 md:mt-5'>
                            <label htmlFor="current_address" className='font-sfpro tracking-wide font-medium
                            text-input text-base mb-1'>Current Address:</label>
                            <input type="text" value={personalInfo.current_address} name="current_address" id="" placeholder='Current Address here'
                                className='pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50'
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                            />
                            {errors.current_address && <span className="text-red-500 text-sm ">{errors.current_address}</span>}
                        </div>
                        <div className='flex flex-col mt-2 md:mt-5'>
                            <label htmlFor="residential_address" className='font-sfpro tracking-wide font-medium
                            text-input text-base mb-1'>Permanent Address:</label>
                            <input type="text" value={personalInfo.residential_address} name="residential_address" id="" placeholder='Permanent Address here'
                                className='pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50'
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                            />
                            {errors.residential_address && <span className="text-red-500 text-sm ">{errors.residential_address}</span>}
                        </div>
                        <div className="flex flex-col md:flex-row md:gap-x-3 lg:gap-x-12">
                            <div className='flex flex-col mt-2 md:mt-5 md:w-1/2'>
                                <label htmlFor="nic" className='font-sfpro tracking-wide font-medium
                            text-input text-base mb-1'>NIC:</label>
                                <input type="number" value={personalInfo.nic} placeholder="NIC Here" name="nic" 
                                    className='pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50'
                                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                                />
                                {errors.nic && <span className="text-red-500 text-sm ">{errors.nic}</span>}
                            </div>
                            <div className='flex flex-col mt-2 md:mt-5 md:w-1/2'>
                                <label htmlFor="passport_number" className='font-sfpro tracking-wide font-medium
                            text-input text-base mb-1'>Passport Number:</label>
                                <input type="text" value={personalInfo.passport_number} data-inputmask="'mask': '99999-9999999-9'" placeholder="Passport Number Here (optional)" name="passport_number" required=""
                                    className='pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50'
                                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                                />
                                {errors.passport_number && <span className="text-red-500 text-sm ">{errors.passport_number}</span>}
                            </div>
                        </div>

                    </div>
                    <div className='order-1 md:order-2 md:w-[35%]'>
                        {/*  */}
                        {/* Image uploader */}
                        <div className='flex flex-col relative md:ml-6 md:mt-5 lg:mt-5 '>
                            <label
                                htmlFor="file-upload"
                                className="flex bg-[#EFEFEF] cursor-pointer text-center overflow-hidden font-bold w-[240px] h-[260px] rounded-3xl my-3"
                            >
                                <div className="w-full h-full flex justify-center items-center border-solid bg-[#EFEFEF] rounded-3xl">
                                    {imagePreview ? (
                                        <img src={imagePreview} alt='Preview' className='w-full h-full' />
                                    ) : (
                                        <>   <span className="text-lg">
                                            <img src={upload} alt='icon here' className='w-20 h-20 block m-auto' />
                                            <span>Upload your photo</span>
                                        </span>
                                        </>

                                    )}
                                </div>
                                <input
                                    id="file-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                                />

                            </label>
                            {errors.image && (
                                <p className="text-red-500 text-sm">{errors.image}</p>
                            )}
                        </div>
                    </div>
                </div>
                <h2 className='text-baseBlue tracking-wide mb-2 mt-2 lg:text-lg lg:mt-6'>Emergency Contact Information:</h2>
                <div className='md:w-[65%] lg:w-[56%]'>

                    <div className="flex flex-col md:flex-row md:gap-x-3 lg:gap-x-12">
                        <div className='flex flex-col mt-2 md:w-1/2'>
                            <label htmlFor="emergency_first_name" className='font-sfpro tracking-wide font-medium
                            text-input text-base mb-1'>First Name:</label>
                            <input type="text" value={personalInfo.emergency_first_name} name="emergency_first_name" id="" placeholder='First Name Here'
                                className='pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50'
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                            />
                            {errors.emergency_first_name && <span className="text-red-500 text-sm ">{errors.emergency_first_name}</span>}
                        </div>
                        <div className='flex flex-col mt-2 md:w-1/2 lg:gap-x-12'>
                            <label htmlFor="emergency_last_name" className='font-sfpro tracking-wide font-medium
                            text-input text-base mb-1'>Last Name:</label>
                            <input type="text" value={personalInfo.emergency_last_name} name="emergency_last_name" id="" placeholder='Last Name Here'
                                className='pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50'
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                            />
                            {errors.emergency_last_name && <span className="text-red-500 text-sm ">{errors.emergency_last_name}</span>}
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row md:gap-x-3 lg:gap-x-12">
                        <div className='flex flex-col mt-2 md:mt-5 md:w-1/2'>
                            <label htmlFor="emergency_phone_no" className='font-sfpro tracking-wide font-medium
                            text-input text-base mb-1'>Phone Number:</label>
                            <div className='flex gap-1'>
                             <input type="tel" value={personalInfo.emergency_country_code} name="emergency_country_code" maxLength={4} id="" placeholder='+1'
                                    className='pl-1 bg-white rounded-l h-8 w-[12%] text-sm placeholder-[#555657] placeholder-opacity-50'
                                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                                />
                            <input type="number" value={personalInfo.emergency_phone_no} name="emergency_phone_no" id="" placeholder='Phone Number here'
                                className='pl-2 bg-white rounded-r h-8 w-[87%] text-sm placeholder-[#555657] placeholder-opacity-50'
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                            />
                            </div>
                            {errors.emergency_country_code && <><span className="text-red-500 text-sm ">{errors.emergency_country_code}</span></>}
                            {errors.emergency_phone_no && <><span className="text-red-500 text-sm ">{errors.emergency_phone_no}</span></>}
                        </div>
                        <div className='flex flex-col mt-2 md:mt-5 md:w-1/2'>
                            <label htmlFor="relation" className='font-sfpro tracking-wide font-medium
                            text-input text-base mb-1'>Relation:</label>
                            <input type="text" value={personalInfo.relation} name="relation" id="" placeholder='Relation Here'
                                className='pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50'
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                            />
                            {errors.relation && <span className="text-red-500 text-sm ">{errors.relation}</span>}
                        </div>
                    </div>
                </div>
                <div className="mt-6 lg:mt-10 md:mt-0 mb-40">
                    <Button onClick={handleNextStep} text={'Next'} />
                </div>
            </div>
        </>
    )
}

export default PersonalInfo

