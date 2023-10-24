import moment from 'moment';
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const SubmitCV = ({ prevstep, nextstep, substep, handleChange, onFileChange }) => {

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    handleChange('cv', selectedFile)
    // onFileChange(selectedFile)
  }
  return (
    <>
      <div className='bg-[#F9F9F9] h-screen overflow-y-auto overflow-x-hidden scroll px-3 md:px-6 lg:px-10'>
        <div className='flex items-center'>
          <div className={`w-3 h-3 rounded-full ${substep === 1 ? 'bg-[#3B82F6]' : ''} mr-1 border`}></div>
          <div className={`w-3 h-3 rounded-full ${substep === 2 ? 'bg-[#3B82F6]' : ''} border`}></div>
        </div>
        <h2 className='text-baseBlue tracking-wide mb-2 lg:mb-4 lg:text-lg mt-2'>Submit Your CV:</h2>
        <div className='flex flex-col md:flex-row lg:gap-x-36'>
          <div className='order-2 md:order-1 md:w-[65%]'>
            <h2 className='text-input opacity-70 tracking-wide text-base mt-3 mb-3 lg:mb-4 lg:text-base'>Attach Your CV:</h2>
            <label htmlFor="file-upload" class="cursor-pointer opacity-70 
            rounded-lg py-1 text-input">
              <input id="file-upload" type="file" name="file" accept=".jpg, .jpeg, .png, .pdf"
                max-size="104857600" download="file" className='leading-5' onChange={handleFileChange} />
            </label>
            <br />
            <small className='text-gray-400'>Upload a jpeg, jpg, png, pdf no larger than 100 MB.</small>
          </div>
        </div>

        <div className="flex gap-x-20">
          <button onClick={prevstep} className='bg-baseBlue rounded-lg text-white w-24 py-[3px] mt-5 md:mt-10'>Previous</button>
          <button onClick={nextstep} className='bg-baseBlue rounded-lg text-white w-24 py-[3px] mt-5 md:mt-10'>Next</button>

        </div>
      </div>
    </>
  )
}

export default SubmitCV