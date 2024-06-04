import logo from "../../../../../assets/images/tecbrix-logo.png";
import {
  CustomButton,
  DateInput,
  SelectComponent,
  TextInput,
} from "../../../../../components/form-control";

const PersonalInfo = () => {
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
              Personal Details
            </h2>
            <hr />
            <div className="flex items-center gap-x-8">
              <div className="bg-[#EEE] w-24 h-24 rounded-full"></div>
              <div className="flex flex-col gap-y-3">
                <input
                  type="file"
                  accept="image/*"
                  class="font-lato"
                  name=""
                  id=""
                />

                <div className="font-lato text-sm font-normal">
                  JPEG or PNG. Max size of 100KB
                </div>
              </div>
            </div>
            {/* name & id */}
            <div className="my-3">
              <div className="font-lato text-lg font-bold text-[#323333]">
                Sakina Burhanuddin
              </div>
              <div className="font-lato text-base font-medium text-baseGray opacity-80">
                ID: TXB-02849
              </div>
            </div>
            <div className="flex flex-wrap gap-x-3">
              <div className="w-full md:w-[48%]">
                <TextInput name="first_name" />
              </div>
              <div className="w-full md:w-[48%]">
                <TextInput name="mobile_no" />
              </div>
              <div className="w-full md:w-[48%]">
                <TextInput name="last_name" />
              </div>
              <div className="w-full md:w-[48%]">
                <TextInput name="work_email" />
              </div>
              <div className="w-full md:w-[48%]">
                <TextInput name="nic" />
              </div>
              <div className="w-full md:w-[48%]">
                <TextInput name="nationality" />
              </div>
              <div className="w-full md:w-[48%]">
                <DateInput name="date_of_birth" />
              </div>
              <div className="w-full md:w-[48%]">
                <SelectComponent name="marital_status" />
              </div>
            </div>
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

export default PersonalInfo;
