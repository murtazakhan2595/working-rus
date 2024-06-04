import logo from "../../../../../assets/images/tecbrix-logo.png";
import {
  CustomButton,
  DateInput,
  SelectComponent,
  TextInput,
} from "../../../../../components/form-control";

const EducationInfo = () => {
  return (
    <div className="h-screen flex justify-center">
      <div className="w-full flex flex-col min-h-full p-3 md:p-5 lg:p-7">
        <div className="flex justify-between">
          <div className="flex justify-start items-start">
            <img
              src={logo}
              className="w-[142px] h-auto md:h-auto lg:pl-5"
              alt="Tecbrix logo"
            />
          </div>
        </div>
        <div className="flex justify-center flex-grow h-[80vh] overflow-y-auto">
          <div className="md:mx-auto w-full md:max-w-3xl">
            <h2 className="text-2xl font-lato font-bold text-[#323333] text-left">
              Academics
            </h2>
            <hr />
            <h2 className="text-[22px] font-lato font-bold text-[#323333] text-left">
              Education 1
            </h2>
            <div className="flex flex-wrap gap-x-3">
              <div className="w-full md:w-[48%]">
                <SelectComponent name="education_level" />
              </div>
              <div className="w-full md:w-[48%]">
                <TextInput name="program" />
              </div>
              <div className="w-full md:w-[48%]">
                <TextInput name="institute_name" />
              </div>
              <div className="w-full md:w-[48%]">
                <DateInput name="edu_start_date" />
              </div>
              <div className="w-full md:w-[48%]">
                <DateInput name="edu_end_date" />
              </div>
              <div className="w-full md:w-[97.5%] bg-[#E5E5F0] flex justify-center items-center h-40">
                <input type="file" name="education_body" id="" />
              </div>
            </div>
            <button className="flex items-center gap-x-2 text-[#323333] text-base font-semibold leading-6 rounded-lg font-opensans md:px-4 border-2 border-[#323333] my-4">
              <div className="text-xl">+</div>
              <div>Add Another</div>
            </button>
            <hr />
            <CustomButton label="Next" />
          </div>
        </div>
        <div className="flex justify-start items-start">
          <p className="font-roboto font-normal text-base text-[#5C5E64] lg:pl-5">
            © 2024 TecBrix
          </p>
        </div>
      </div>
    </div>
  );
};

export default EducationInfo;
