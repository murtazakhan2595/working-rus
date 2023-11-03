import React from 'react';
import Datepicker from '../modules/Dashboard/Datepicker';
import moment from 'moment';
import SubStepsIndicator from './SubStepsIndicator';
import Button from './Button';

const ProfessionalExp = ({ formData, errors, setErrors, substep, prevstep, nextstep, handleChange }) => {
  const { experienceSections = [{}] } = formData;

  const updateExperienceField = (field, value, experienceIndex) => {
    const updatedExperienceSections = [...experienceSections];
    updatedExperienceSections[experienceIndex] = {
      ...updatedExperienceSections[experienceIndex],
      [field]: value,
    };
    handleChange('experienceSections', updatedExperienceSections);
  };

  const handleStartDate = (date, index) => {
    const formattedDate = moment(date).format('DD-MM-YYYY').toLowerCase();
    updateExperienceField('exstartdate', formattedDate, index);
    clearError(`exstartdate_${index}`);
  };

  const handleEndDate = (date, index) => {
    const formattedDate = moment(date).format('DD-MM-YYYY').toLowerCase();
    updateExperienceField('exenddate', formattedDate, index);
    clearError(`exenddate_${index}`);
  };

  const handleFileChange = (selectedFile, experienceIndex) => {
    updateExperienceField('file', selectedFile, experienceIndex);
    clearError(`file_${experienceIndex}`);
  };

  const clearError = (fieldName) => {
    if (errors[fieldName]) {
      // Create a copy of the errors object without the specific field error
      const updatedErrors = { ...errors };
      delete updatedErrors[fieldName];
      setErrors(updatedErrors);
    }
  };

  const addNewExperience = () => {
    handleChange('experienceSections', [
      ...experienceSections,
      {
        organization: '',
        designation: '',
        exstartdate: '',
        exenddate: '',
      },
    ]);
  };

  const handleNextStep = () => {
    const fieldErrors = {};

    // Validate the experienceSections and store specific errors
    for (let i = 0; i < experienceSections.length; i++) {
      const experience = experienceSections[i];
      if (!experience.organization) {
        fieldErrors[`organization_${i}`] = 'Organization is required.';
      }
      if (!experience.designation) {
        fieldErrors[`designation_${i}`] = 'Designation is required.';
      }
      if (!experience.exstartdate) {
        fieldErrors[`exstartdate_${i}`] = 'Start Date is required.';
      }
      if (!experience.exenddate) {
        fieldErrors[`exenddate_${i}`] = 'End Date is required.';
      }
      if (!experience.file) {
        fieldErrors[`file_${i}`] = 'Experience Letter is required.';
      }
    }

    if (Object.keys(fieldErrors).length > 0) {
      // Set specific error messages for each field
      setErrors(fieldErrors);
    } else {
      // Clear any previous errors
      setErrors({});

      // Proceed to the next step
      nextstep();
    }
  };

  return (
    <div className="bg-[#F9F9F9] h-screen overflow-y-auto overflow-x-hidden scroll px-3 md:px-6 lg:px-10">
      <SubStepsIndicator substep={substep} />
      <h2 className="text-baseBlue tracking-wide mb-2 lg:mb-4 lg:text-lg mt-2">Professional Experience:</h2>
      <div className="flex flex-col md:flex-row lg:gap-x-36">
        <div className="order-2 md:order-1 md:w-[60%]">
          {experienceSections.map((experience, index) => (
            <div className="flex flex-col" key={index}>
              <div className="flex flex-col md:flex-row md:gap-x-3 lg:gap-x-12">
                <div className="flex flex-col mt-2 md:mt-5 md:w-1/2">
                  <label htmlFor="organization" className="font-sfpro tracking-wide font-medium text-input text-base mb-1">Organization:</label>
                  <input
                    type="text"
                    name='organization'
                    placeholder='Organization'
                    value={experience.organization}
                    className='pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50'
                    onChange={(e) => updateExperienceField('organization', e.target.value, index)}
                  />
                  {errors[`organization_${index}`] && <div className="text-red-500 text-sm">{errors[`organization_${index}`]}</div>}
                </div>
                <div className="flex flex-col mt-2 md:mt-5 md:w-1/2">
                  <label htmlFor="designation" className="font-sfpro tracking-wide font-medium text-input text-base mb-1">Designation:</label>
                  <input
                    type="text"
                    name='designation'
                    placeholder='Designation'
                    className='pl-2 bg-white rounded h-8 text-sm placeholder-[#555657] placeholder-opacity-50'
                    value={experience.designation}
                    onChange={(e) => updateExperienceField('designation', e.target.value, index)}
                  />
                  {errors[`designation_${index}`] && <div className="text-red-500 text-sm">{errors[`designation_${index}`]}</div>}
                </div>
              </div>
              <div className="flex flex-col md:flex-row md:gap-x-3 lg:gap-x-12">
                <div className="flex flex-col mt-2 md:mt-5 md:w-1/2">
                  <label htmlFor="startdate" className="font-sfpro tracking-wide font-medium text-input text-base mb-1">Start Date:</label>
                  <Datepicker
                    name="startdate"
                    selected={moment(experience.exstartdate, 'DD-MM-YYYY').toDate()}
                    onChange={(date) => handleStartDate(date, index)}
                  />
                  {errors[`exstartdate_${index}`] && <div className="text-red-500 text-sm">{errors[`exstartdate_${index}`]}</div>}
                </div>
                <div className="flex flex-col mt-2 md:mt-5 md:w-1/2">
                  <label htmlFor="enddate" className="font-sfpro tracking-wide font-medium text-input text-base mb-1">End Date:</label>
                  <Datepicker
                    name="enddate"
                    selected={moment(experience.exenddate, 'DD-MM-YYYY').toDate()}
                    onChange={(date) => handleEndDate(date, index)}
                  />
                  {errors[`exenddate_${index}`] && <div className="text-red-500 text-sm">{errors[`exenddate_${index}`]}</div>}
                </div>
              </div>
              <div className="flex flex-col md:flex-row md:gap-x-3 lg:gap-x-12">
                <div className="flex flex-col mt-2 md:mt-4">
                  <h2 className="text-input tracking-wide text-base mt-3 mb-1 lg:text-base">Experience Letter:</h2>
                  <label htmlFor="file-upload" className="cursor-pointer opacity-70 rounded-lg text-input">
                    <input
                      id="file-upload"
                      type="file"
                      name="file"
                      accept=".jpg, .jpeg, .png, .pdf"
                      max-size="104857600"
                      onChange={(e) => handleFileChange(e.target.files[0], index)}
                    />
                  </label>
                  <br />
                  {errors[`file_${index}`] && <div className="text-red-500 text-sm">{errors[`file_${index}`]}</div>}
                  <small className="text-gray-400">Upload a jpeg, jpg, png, pdf no larger than 100 MB.</small>
                </div>
              </div>
            </div>
          ))}
          <button onClick={addNewExperience} className="mt-4 mb-10 rounded-lg w-52 border border-[#25A8E0] cursor-pointer text-[#555657] py-1">
            <span className="text-[#25A8E0] font-bold text-xl mr-2">+</span>Add New Experience
          </button>
        </div>
      </div>
      <div className="flex gap-x-20 mb-40 mt-6 md:mt-0">
        <Button onClick={prevstep} text={'Previous'} />
        <Button onClick={handleNextStep} text={'Next'} />
      </div>
    </div>
  );
};

export default ProfessionalExp;
