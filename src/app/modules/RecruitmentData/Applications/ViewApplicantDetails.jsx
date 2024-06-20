import { RxCross2 } from "react-icons/rx";
import { LuExternalLink } from "react-icons/lu";
import { Link } from "react-router-dom";
import dots from "../../../../assets/images/dots.svg";
import pdfIcon from "../../../../assets/images/pdfIcon.svg";
import { CiEdit } from "react-icons/ci";
import { PiBriefcaseThin } from "react-icons/pi";
import {
  IoArrowForward,
  IoChevronBack,
  IoChevronForward,
} from "react-icons/io5";
import { convertToK } from "../../../../utils/ConvertToK";
import { AiOutlineDownload } from "react-icons/ai";

const ViewApplicantDetails = () => {
  return (
    <div className="absolute top-0 right-0 w-[42%] h-full bg-white shadow-lg z-10 p-8 overflow-y-auto hideScroll">
      {/* <div className="absolute right-6 top-6 cursor-pointer" onClick={onClose}>
        <RxCross2 className="text-baseGray" />
      </div> */}
      <div className="absolute right-6 top-6 cursor-pointer">
        <div className="flex justify-between items-center w-[500px] border-b border-[#D7E4FF] b-2">
          <div className="flex items-center gap-x-3">
            <h2 className="font-bold text-xl text-baseGray font-lato">
              Applicant details
            </h2>
            <div className="flex justify-center font-lato text-baseGray">
              <button className="flex items-center px-2 py-2">
                <IoChevronBack className="mr-2" /> Previous
              </button>
              <button className="flex items-center px-2 py-2 ml-4">
                Next <IoChevronForward className="ml-2" />
              </button>
            </div>
          </div>
          <RxCross2 className="text-baseGray" />
        </div>
      </div>

      <div class="mb-4 flex items-center justify-between mt-9">
        <div>
          <p class="font-lato text-base text-baseGray mb-2">1234</p>
          <h2 class="text-2xl font-lato font-bold text-[#323333]">
            Sakina Burhanuddin
          </h2>
        </div>
        <div className="font-lato text-base text-baseGray flex items-center gap-x-4">
          <Link
            to={`/applicants/47}`}
            className="border px-3 py-1.5 rounded-md border-black flex items-center gap-x-2"
          >
            {/* <CiEdit className="text-xl" /> */}
            Action
          </Link>
          <LuExternalLink />
          <img
            src={dots}
            alt=""
            // onClick={() => handleDotsClick(post)}
            className="cursor-pointer"
          />
        </div>
      </div>
      <div className="flex items-center gap-x-4 mb-8">
        <div className="bg-[#E6E9F0] rounded-2xl px-2">3 Years</div>
        <div className="bg-[#E6E9F0] rounded-2xl px-2">$ 30,000</div>
        <div className="bg-[#E6E9F0] rounded-2xl px-2">Pakistan</div>
      </div>
      <div class="grid grid-cols-3 gap-x-8 gap-y-4 mb-4 border border-gray-400 rounded-lg px-3 py-4">
        <div>
          <p class="text-[14px] font-normal font-lato text-baseGray">Email</p>
          <p class="text-base font-semibold font-lato text-baseGray">
            sakina@tecbrix.com
          </p>
        </div>
        <div>
          <p class="text-[14px] font-normal font-lato text-baseGray">
            Phone number
          </p>
          <p class="text-base font-semibold font-lato text-baseGray">WFH</p>
        </div>
        <div>
          <p class="text-[14px] font-normal font-lato text-baseGray">
            Education
          </p>
          <p class="text-base font-semibold font-lato text-baseGray">
            Bachelors
          </p>
        </div>
        <div>
          <p class="text-[14px] font-normal font-lato text-baseGray">
            Applied on
          </p>
          <p class="text-base font-semibold font-lato text-baseGray">
            22-07-2024
          </p>
        </div>
        <div>
          <p class="text-[14px] font-normal font-lato text-baseGray">
            Applied for
          </p>
          <p class="text-base font-semibold font-lato text-baseGray">
            Product Designer
          </p>
        </div>
        <div>
          <p class="text-[14px] font-normal font-lato text-baseGray">
            Expected Salary
          </p>
          <p class="text-base font-semibold font-lato text-baseGray">
            {/* {convertToK(post?.min_salary)} - {convertToK(post?.max_salary)} */}
            $80K - $100K
          </p>
        </div>
        <div>
          <p class="text-[14px] font-normal font-lato text-baseGray">
            Notice Period
          </p>
          <p class="text-base font-semibold font-lato text-baseGray">14 days</p>
        </div>
        <div>
          <p class="text-[14px] font-normal font-lato text-baseGray">
            Available for Interview
          </p>
          <p class="text-base font-semibold font-lato text-baseGray">
            29-08-2024
          </p>
        </div>
      </div>

      <div className="mt-3">
        <h3 className="font-lato font-bold text-base text-[#323333]">
          Job Description
        </h3>

        <div className="bg-[#F0F1F2] rounded-lg p-2 flex justify-between items-center">
          <div className="flex gap-x-3">
            <img src={pdfIcon} alt="" />
            <p class="text-[14px] font-lato text-[#323333]">sakina Burhan</p>
          </div>
          <div className="flex gap-x-2">
            <p class="text-[14px] font-lato text-[#323333]">Download</p>
            <AiOutlineDownload />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewApplicantDetails;
