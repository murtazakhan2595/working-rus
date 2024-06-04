import logo from "../../../../../assets/images/tecbrix-logo.png";
import {
  CustomButton,
  DateInput,
  SelectComponent,
  TextInput,
} from "../../../../../components/form-control";

const CertificationsInfo = () => {
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
              Certification and Licences
            </h2>
            <hr />
            <h2 className="text-[22px] font-lato font-bold text-[#323333] text-left">
              Course 1
            </h2>
            <div className="flex flex-wrap gap-x-3">
              <div className="w-full md:w-[48%]">
                <TextInput name="certification_name" />
              </div>
              <div className="w-full md:w-[48%]">
                <DateInput name="completion_date" />
              </div>
              <div className="w-full md:w-[48%]">
                <DateInput name="expiry_date" />
              </div>
              <div className="w-full md:w-[48%]">
                <TextInput name="certification_institute" />
              </div>
              <div className="w-full md:w-[97.5%] bg-[#E5E5F0] flex justify-center items-center h-40">
                <input type="file" name="certification_body" id="" />
              </div>
            </div>
            <button className="flex items-center gap-x-2 text-[#323333] text-base font-semibold leading-6 rounded-lg font-opensans md:px-4 border-2 border-[#323333] my-4">
              <div className="text-xl">+</div>
              <div>Add Another</div>
            </button>
            <hr />
            <div className="flex justify-end items-center gap-x-2">
              <CustomButton label="Skip" />
              <CustomButton label="Next" />
            </div>
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

export default CertificationsInfo;
