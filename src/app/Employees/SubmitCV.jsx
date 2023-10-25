import Joi from 'joi';
import SubStepsIndicator from './SubStepsIndicator';
import Button from './Button';

const cvSchema = Joi.object({
  cv: Joi.object().required().label('CV').keys({
    name: Joi.string().required(),
    type: Joi.string().valid('application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document').required(),
    size: Joi.number().max(104857600).required(),
  }),
});


const SubmitCV = ({ formData, errors, setErrors, prevstep, nextstep, substep, handleChange, onFileChange }) => {
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    const cvData = {
      name: selectedFile.name,
      type: selectedFile.type,
      size: selectedFile.size,
    };

    // Add the "cv" object to your formData
    const updatedFormData = {
      ...formData,
      cv: cvData,
    };

    handleChange('cv', cvData);
  }

  const handleNextStep = () => {
    // Validate only the fields for this step using cvSchema
    const { error } = cvSchema.validate({ cv: formData.cv }, { abortEarly: false });

    if (error) {
      const validationErrors = { cv: error.details[0].message };
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
              <input id="file-upload" type="file" name="file" accept=".doc, .docx"
                max-size="104857600" className='leading-5' onChange={handleFileChange} />
            </label>

            <br />
            <div>{errors.cv && <span className="text-red-500 text-sm ">{errors.cv}</span>}</div>
            <small className='text-gray-400'>Upload a doc or docx file and no larger than 100 MB.</small>
          </div>
        </div>

        <div className="flex gap-x-20">
          <Button onClick={prevstep} text={'Previous'} />
          <Button onClick={handleNextStep} text={'Next'} />
        </div>
      </div>
    </>
  )
}

export default SubmitCV