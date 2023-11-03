import moment from 'moment';
import React, { useState } from 'react';
import Datepicker from '../modules/Dashboard/Datepicker';
import Select from 'react-select';
import Joi from 'joi';
import Button from './Button';

const academicOptions = [
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'bachelors', label: 'Bachelors' },
  { value: 'masters', label: 'Masters' },
];

const academicSchema = Joi.object({
  academic: Joi.string().required().label('Education Level'),
  program: Joi.string().required().label('Program'),
  institute: Joi.string().required().label('Institute Name'),
  acdstartdate: Joi.string().required().label('Start Date'),
  acdenddate: Joi.string().required().label('End Date'),
  certification: Joi.object().required().label('Certification').meta({ type: 'file' }),
});


const AcademicRecords = ({ formData, errors, setErrors, prevstep, nextstep, handleChange, onFileChange }) => {
  const { program, institute, acdstartdate, acdenddate } = formData;
  const [academic, setAcademic] = useState(''); // State for education level

  // Handle file input change
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    handleChange('certification', selectedFile);
    // onFileChange(selectedFile)
  }

  const handleStartDate = (date) => {
    const formattedDate = moment(date).format("DD-MM-YYYY").toLowerCase();
    handleChange('acdstartdate', formattedDate);
  };

  const handleEndDate = (date) => {
    const formattedDate = moment(date).format("DD-MM-YYYY").toLowerCase();
    handleChange('acdenddate', formattedDate);
  };

  const handleNextStep = () => {
    const { error } = academicSchema.validate(
      {
        academic: formData.academic,
        program: formData.program,
        institute: formData.institute,
        acdstartdate: formData.acdstartdate,
        acdenddate: formData.acdenddate,
        certification: formData.certification,
      },
      { abortEarly: false }
    );

    if (error) {
      const validationErrors = {};
      error.details.forEach((detail) => {
        validationErrors[detail.path[0]] = detail.message;
      });
      setErrors(validationErrors);
      console.log("Validation errors:", validationErrors);
    } else {
      nextstep();
      console.log("Proceeding to the next step...");
    }
  };




  return (
    <>
      <div className='bg-[#F9F9F9] h-screen overflow-y-auto overflow-x-hidden scroll px-3 md:px-6 lg:px-10'>
        <h2 className='text-baseBlue tracking-wide mb-2 lg:mb-4 lg:text-lg mt-2'>Academic Records:</h2>
        <div className='flex flex-col md:flex-row lg:gap-x-36'>
          <div className='order-2 md:order-1 md:w-[55%]'>
            <div className="flex flex-col">
              <div className="flex flex-col md:flex-row md:gap-x-3 lg:gap-x-12">
                <div className='flex flex-col mt-2 md:mt-5 md:w-1/2'>
                  <label htmlFor="education" className='font-sfpro tracking-wide 
                  font-medium text-input text-base mb-1'>Education Level:</label>
                  <Select
                    name="education"
                    value={academicOptions.find((option) => option.value === academic)}
                    options={academicOptions}
                    isSearchable={false}
                    className="focus:outline-none border-none"
                    onChange={(selectedOption) => {
                      handleChange('academic', selectedOption.value);
                    }}
                  />
                  {errors.academic && <div className="text-red-500 text-sm">{errors.academic}</div>}

                </div>
                <div className='flex flex-col mt-2 md:mt-5 md:w-1/2'>
                  <label htmlFor="program" className='font-sfpro tracking-wide font-medium
                            text-input text-base mb-1'>Program:</label>
                  <input type="text" value={program} name="program" id="" placeholder='Program Here'
                    className='pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50'
                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                  />
                  {errors.program && <div className="text-red-500 text-sm">{errors.program}</div>}

                </div>
              </div>
              <div className='flex flex-col mt-2 md:mt-5'>
                <label htmlFor="institute" className='font-sfpro tracking-wide font-medium
                            text-input text-base mb-1'>Institute Name:</label>
                <input type="text" value={institute} name="institute" id="" placeholder='Institute Name Here'
                  className='pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50'
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                />
                {errors.institute && <div className="text-red-500 text-sm">{errors.institute}</div>}

              </div>
              <div className="flex flex-col md:flex-row md:gap-x-3 lg:gap-x-12">
                <div className='flex flex-col mt-2 md:mt-5 md:w-1/2'>
                  <label htmlFor="startdate" className='font-sfpro tracking-wide font-medium
                            text-input text-base mb-1'>Start Date:</label>
                  <Datepicker
                    name="startdate"
                    selected={moment(acdstartdate, "DD-MM-YYYY").toDate()}
                    onChange={handleStartDate}
                  />
                  {errors.acdstartdate && <div className="text-red-500 text-sm">{errors.acdstartdate}</div>}

                </div>
                <div className='flex flex-col mt-2 md:mt-5 md:w-1/2'>
                  <label htmlFor="enddate" className='font-sfpro tracking-wide font-medium
                            text-input text-base mb-1'>End Date:</label>
                  <Datepicker
                    name="enddate"
                    selected={moment(acdenddate, "DD-MM-YYYY").toDate()}
                    onChange={handleEndDate}
                  />
                  {errors.acdenddate && <div className="text-red-500 text-sm">{errors.acdenddate}</div>}

                </div>
              </div>
              <div className="flex flex-col md:flex-row md:gap-x-3 lg:gap-x-12">
                <div className='flex flex-col mt-2 md:mt-4'>
                  <h2 className='text-input tracking-wide text-base mt-3 mb-3 lg:mb-0 lg:text-base'>Attach Certification:</h2>
                  <label htmlFor="file-upload" className="cursor-pointer opacity-70 
                    rounded-lg py-1 text-input">
                    <input id="file-upload" type="file" name="file" accept=".jpg, .jpeg, .png, .pdf"
                      max-size="104857600" download="file" className='leading-5' onChange={handleFileChange} />
                  </label>
                  {errors.certification && <div className="text-red-500 text-sm">{errors.certification}</div>}
                  <small className='text-gray-400'>Upload a jpeg, jpg, png, pdf no larger than 100 MB.</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-x-20 mt-6 lg:mt-10 md:mt-10 mb-40">
          <Button onClick={prevstep} text={'Previous'} />
          <Button onClick={handleNextStep} text={'Next'} />
        </div>
      </div>
    </>
  );
}

export default AcademicRecords;
