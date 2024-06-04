import logo from "../../../../../assets/images/tecbrix-logo.png";
import {
  CustomButton,
  DateInput,
  SelectComponent,
  TextInput,
} from "../../../../../components/form-control";

const ContactInfo = () => {
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
              Contact Information
            </h2>
            <hr />
            {/* emergency contact */}
            <h2 className="text-[22px] font-lato font-bold text-[#323333] text-left">
              Emergency Contact
            </h2>
            <div className="flex flex-wrap gap-x-3">
              <div className="w-full md:w-[48%]">
                <TextInput name="emergency_phone_no" />
              </div>
              <div className="w-full md:w-[48%]">
                <TextInput name="emergency_first_name" />
              </div>
              <div className="w-full md:w-[48%]">
                <TextInput name="emergency_last_name" />
              </div>
              <div className="w-full md:w-[48%]">
                <TextInput name="emergency_relation" />
              </div>
            </div>
            {/* Permanent Address */}
            <h2 className="text-[22px] font-lato font-bold text-[#323333] text-left">
              Permanent Address
            </h2>
            <div className="flex flex-wrap gap-x-3">
              <div className="w-full md:w-[48%]">
                <TextInput name="first_name" />
              </div>
              <div className="w-full md:w-[48%]">
                <TextInput name="mobile_no" />
              </div>
            </div>
            {/* Permanent Address */}
            <h2 className="text-[22px] font-lato font-bold text-[#323333] text-left">
              Present Address
            </h2>
            <div className="flex flex-wrap gap-x-3">
              <div className="w-full md:w-[48%]">
                <TextInput name="current_address" />
              </div>
              <div className="w-full md:w-[48%]">
                <TextInput name="mobile_no" />
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

export default ContactInfo;
