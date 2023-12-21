import { MdOutlineCalendarMonth } from "react-icons/md";
import { IoMdClock } from "react-icons/io";
import { IoLocationOutline } from "react-icons/io5";
import { LiaMoneyBillWaveSolid } from "react-icons/lia";
import { PiSuitcaseThin } from "react-icons/pi";
import { FcGraduationCap } from "react-icons/fc";
import { IoPersonCircleOutline } from "react-icons/io5";

const JobDescription = () => {
  return (
    <>
      <div className="">
        <div className="border border-gray-400 px-4 xl:px-8">
          <p className="pt-4 pb-2 text-input font-sfpro text-sm md:text-base">
            Job ID: 12345
          </p>
          <h1 className="text-black text-2xl font-black">Software Engineer</h1>

          {/* job details */}
          <div
            className={`mt-3 md:mt-4 flex flex-col justify-between xl:items-center xl:flex-row xl:justify-between pb-2 xl:pb-4`}
          >
            <div className="flex flex-wrap gap-x-[34px] md:flex-row md:flex-wrap gap-y-2 xl:gap-x-8">
            {/* <div className="flex flex-wrap gap-x-[33px] gap-y-2 xl:gap-x-8"> */}
              <div className="flex flex-wrap items-center gap-x-2 md:w-[30%] xl:w-auto">
                <div className="text-[28px]">
                  <MdOutlineCalendarMonth />
                </div>
                <div className="flex">
                  <div className="text-sm md:text-base">
                    {" "}
                    <p>Open: 14/12/2023</p>
                    <p>Deadline: 14/12/2023</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-x-2 md:w-[30%] xl:w-auto">
                <div className="text-[28px]">
                  <IoMdClock />
                </div>
                <div className="flex">
                  <div className="text-sm md:text-base">
                    {" "}
                    <p>Full Time</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-x-2 md:w-[30%] xl:w-auto ml-[50px] md:ml-0">
                <div className="text-[28px]">
                  <IoLocationOutline />
                </div>
                <div className="flex">
                  <div className="text-sm md:text-base">
                    {" "}
                    <address>Pakistan</address>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-x-2 md:w-[30%] xl:w-auto">
                <div className="text-[28px]">
                  <LiaMoneyBillWaveSolid />
                </div>
                <div className="flex">
                  <div className="text-sm md:text-base">
                    {" "}
                    <p>50,000 - 80,000</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-x-2 md:w-[30%] xl:w-auto">
                <div className="text-[28px]">
                  <PiSuitcaseThin />
                </div>
                <div className="flex">
                  <div className="text-sm md:text-base">
                    {" "}
                    <p>Remote</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center  gap-x-2 md:w-[30%] xl:w-auto">
                <div className="text-[28px]">
                  <FcGraduationCap />
                </div>
                <div className="flex">
                  <div className="text-sm md:text-base">
                    {" "}
                    <p>Bachelors CS</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center  gap-x-2 md:w-[30%] xl:w-auto ml-[25px] md:ml-0">
                <div className="text-[28px]">
                  <IoPersonCircleOutline />
                </div>
                <div className="flex">
                  <div className="text-sm md:text-base">
                    {" "}
                    <p>Fresher</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center md:flex-end">
              <button className="md:w-[25%] mt-2 md:-mt-8 xl:mt-0 xl:w-full bg-baseBlue text-white px-5 py-1 rounded-md font-sfpro">
                Apply Now
              </button>
            </div>
          </div>
        </div>
        {/* job description */}
        <div className="bg-[#F9F9F9] px-6 xl:px-14 overflow-y-auto max-h-[500px] h-[600px]">
          <h2 className="py-5 text-baseBlue text-xl font-semibold">
            Job Description:
          </h2>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident,
            ad cumque quae animi tempore nulla exercitationem quas vel! Tempora
            assumenda repellendus ea temporibus autem amet reiciendis laboriosam
            architecto, a blanditiis molestias. Perspiciatis provident neque
            natus doloremque mollitia labore eaque quisquam, dolor animi? Ea
            minima eligendi minus nobis. Deserunt, perspiciatis. Delectus at
            maxime numquam tempora veniam nemo maiores nobis aut quas eaque
            repudiandae iusto enim vero dolorem odit provident doloribus
            corrupti porro ut earum tempore, omnis quia mollitia. A minima eum
            ducimus consequatur ex dignissimos odit eligendi dolor. Dolores
            explicabo assumenda architecto facilis quae ad corporis vitae animi!
            Ab, ipsa voluptatum?
          </p>
        </div>
      </div>
    </>
  );
};

export default JobDescription;
