import React, { useState } from 'react';
import Datepicker from '../modules/Dashboard/Datepicker';
import moment from 'moment';

const ProfessionalExp = ({ formData, substep, prevstep, nextstep, handleChange, onFileChange }) => {
  const { experience, experienceSections } = formData;

  const handleExperienceChange = (name, value, experienceIndex) => {
    handleChange(name, value, experienceIndex);
  }

  // Function to handle file changes for each experience section
  const handleFileChange = (selectedFile, experienceIndex) => {
    handleExperienceChange('file', selectedFile, experienceIndex);
  }

  const addNewExperience = () => {
    handleChange('experienceSections', [
      ...experienceSections,
      {
        organization: '',
        designation: '',
        exstartdate: '',
        exenddate: '',
        file: null
      }
    ]);
  }
  const handleStartDate = (date, index) => {
    const formattedDate = moment(date).format("DD-MM-YYYY").toLowerCase();
    const updatedExperience = [...experienceSections];
    updatedExperience[index].exstartdate = formattedDate;
    handleChange('experienceSections', updatedExperience);
  };

  const handleEndDate = (date, index) => {
    const formattedDate = moment(date).format("DD-MM-YYYY").toLowerCase();
    const updatedExperience = [...experienceSections];
    updatedExperience[index].exenddate = formattedDate;
    handleChange('experienceSections', updatedExperience);
  };

  return (
    <>
      <div className='bg-[#F9F9F9] h-screen overflow-y-auto overflow-x-hidden scroll px-3 md:px-6 lg:px-10'>
        <div className='flex items-center'>
          <div className={`w-3 h-3 rounded-full ${substep === 1 ? 'bg-[#3B82F6]' : ''} mr-1 border`}></div> {/* Conditional Filled Circle for Page 1 */}
          <div className={`w-3 h-3 rounded-full ${substep === 2 ? 'bg-[#3B82F6]' : ''} border`}></div> {/* Conditional Filled Circle for Page 2 */}
        </div>
        <h2 className='text-baseBlue tracking-wide mb-2 lg:mb-4 lg:text-lg mt-2'>Professional Experience:</h2>
        <div className='flex flex-col md:flex-row lg:gap-x-36'>
          <div className='order-2 md:order-1 md:w-[60%]'>
            {experienceSections.map((experience, index) => (
              <div className="flex flex-col" key={index}>
                <div className="flex flex-col md:flex-row md:gap-x-3 lg:gap-x-12">
                  <div className='flex flex-col mt-2 md:mt-5 md:w-1/2'>
                    <label htmlFor="organization" className='font-sfpro tracking-wide font-medium
                            text-input text-base mb-1'>Organization:</label>
                    <input type="text" name="organization" value={experience.organization} placeholder='Organization Name Here'
                      className='pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50'
                      onChange={(e) => handleChange('experienceSections', experienceSections.map((item, i) => i === index ? { ...item, organization: e.target.value } : item))}
                    />
                  </div>
                  <div className='flex flex-col mt-2 md:mt-5 md:w-1/2'>
                    <label htmlFor="designation" className='font-sfpro tracking-wide font-medium
                            text-input text-base mb-1'>Designation:</label>
                    <input type="text" value={experience.designation} name="designation" placeholder='Designation Here'
                      className='pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50'
                      onChange={(e) => handleChange('experienceSections', experienceSections.map((item, i) => i === index ? { ...item, designation: e.target.value } : item))}
                    />
                  </div>
                </div>
                <div className="flex flex-col md:flex-row md:gap-x-3 lg:gap-x-12">
                  <div className='flex flex-col mt-2 md:mt-5 md:w-1/2'>
                    <label htmlFor="startdate" className='font-sfpro tracking-wide font-medium
                            text-input text-base mb-1'>Start Date:</label>
                    <Datepicker
                      name="startdate"
                      className="z-50"
                      selected={moment(experience.exstartdate, "DD-MM-YYYY").toDate()}
                      onChange={(date) => handleStartDate(date, index)}
                    />
                  </div>
                  <div className='flex flex-col mt-2 md:mt-5 md:w-1/2'>
                    <label htmlFor="enddate" className='font-sfpro tracking-wide font-medium
                            text-input text-base mb-1'>End Date:</label>
                    <Datepicker
                      name="enddate"
                      className="z-50"
                      selected={moment(experience.exenddate, "DD-MM-YYYY").toDate()}
                      onChange={(date) => handleEndDate(date, index)}
                    />
                  </div>
                </div>
                <div className="flex flex-col md:flex-row md:gap-x-3 lg:gap-x-12">
                  <div className='flex flex-col mt-2 md:mt-4'>
                    <h2 className='text-input tracking-wide text-base mt-3 mb-3 lg:mb-4 lg:text-base'>Experience Letter:</h2>
                    <label htmlFor="file-upload" className="cursor-pointer opacity-70 
            rounded-lg py-1 text-input">
                      <input id="file-upload" type="file" name="file" accept=".jpg, .jpeg, .png, .pdf"
                        max-size="104857600" download="file" onChange={(e) => handleFileChange(e.target.files[0], index)} />
                    </label>
                    <br />
                    <small className='text-gray-400'>Upload a jpeg, jpg, png, pdf no larger than 100 MB.</small>
                  </div>
                </div>
              </div>
            ))}

            <button onClick={addNewExperience} className='mt-4 mb-10 rounded-lg w-52 border border-[#25A8E0] cursor-pointer text-[#555657] py-1'>
              <span className='text-[#25A8E0] font-bold text-xl mr-2'>+</span>Add New Experience
            </button>
          </div>
        </div>

        <div className="flex gap-x-20 lg:mb-40">
          <button onClick={prevstep} className='bg-baseBlue rounded-lg text-white w-24 py-[3px] mt-5 md:mt-0 mb-40 lg:mb-4'>Previous</button>
          <button onClick={nextstep} className='bg-baseBlue rounded-lg text-white w-24 py-[3px] mt-5 md:mt-0 mb-40 lg:mb-4'>Next</button>
        </div>
      </div>
    </>
  )
}

export default ProfessionalExp;
