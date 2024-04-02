import SubStepsIndicator from './SubStepsIndicator';
import Button from './Button';
import { useState, useEffect } from 'react';


const SubmitCV = ({ errors, setErrors, prevstep, nextstep, substep }) => {
  const getDataFromSessionStorage = (key) => {
    const serializedData = sessionStorage.getItem(key);
    const data = JSON.parse(serializedData);
    return data;
  };
  let getCV = getDataFromSessionStorage("cv")
  const [cv, setCv] = useState(getCV)
  const [cvName, setCvName] = useState(getCV?.name ? getCV?.name : "No Chosen File")
  const setDataInSessionStorage = (key, data) => {
    const serializedData = JSON.stringify(data);
    sessionStorage.setItem(key, serializedData);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const cvData = {
        name: file.name,
        type: file.type,
        size: file.size,
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        setCv({ "name": cvData.name, "file": e.target.result })
        setCvName(cvData.name)
      }
      reader.readAsDataURL(file);
      setErrors({ 'cv': "" });
    } if (!file) {
      const validationErrors = { cv: "Select Valid File" };
      setErrors(validationErrors);
    }
  }

  useEffect(() => {
    setDataInSessionStorage('cv', cv)
  }, [cv])

  const handleNextStep = () => {
    if (!cvName) {
      const validationErrors = { cv: "CV is required" };
      setErrors(validationErrors);
    } else {
      nextstep();
    }
  };

  return (
    <>
      <div className='bg-[#F9F9F9] h-screen overflow-y-auto overflow-x-hidden scroll px-3 md:px-6 lg:px-10'>
        <SubStepsIndicator substep={substep} />
        <h2 className='text-baseBlue tracking-wide mb-2 lg:mb-4 lg:text-lg mt-2'>Submit Your CV:</h2>
        <div className='flex flex-col md:flex-row lg:gap-x-36'>
          <div className='order-2 md:order-1 md:w-[65%]'>
            <h2 className='text-input opacity-70 tracking-wide text-base mt-3 mb-3 lg:mb-4 lg:text-base'>Attach Your CV:</h2>
            <label htmlFor="file-upload" className="cursor-pointer opacity-70 
            rounded-lg py-1 text-input">
              <div className='flex'>
                <div className='bg-gray-200 border-gray-400 border py-1 px-3 rounded-l-md '>Upload CV</div>
                <div className='py-1 px-3 border-gray-200 border rounded-r-md'>{cvName}</div>
              </div>
              <input id="file-upload" type="file" name="cv" accept=".doc, .docx"
                max-size="104857600" className='hidden' onChange={handleFileChange} />
            </label>
            {errors.cv && <small className='text-red-500'>{errors.cv}</small>}
            <br />
            <small className='text-gray-400'>Upload a doc or docx file and no larger than 100 MB.</small>
          </div>
        </div>
        <div className="flex gap-x-20 mt-6 lg:mt-10 md:mt-0 mb-40">
          <Button onClick={prevstep} text={'Previous'} />
          <Button onClick={handleNextStep} text={'Next'} />
        </div>
      </div>
    </>
  )
}

export default SubmitCV;
