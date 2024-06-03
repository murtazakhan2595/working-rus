import React from "react";
import { FiDownload } from "react-icons/fi";

const Experience = ({cv, experience }) => {
  return (
    <div className="bg-white shadow border w-full rounded-lg p-4 mb-6">
      <div className="flex justify-between">
      <h2 className="text-xl mb-4">Experience</h2>
      {cv?.cv?.file &&
        <a download={cv?.cvName}
        className="flex items-center gap-x-2 mb-3 text-sm opacity-50 font-semibold border border-black rounded-lg font-opensans px-4 no-underline text-black"
        href={cv?.cv?.file}> Resume <FiDownload /></a>
      }
      </div>
      <hr />
      <div className="py-4 overflow-auto no-scrollbar">
        {experience?.map((exp, index) => (
          <div key={index} className="w-full mb-7">
            <div className="flex flex-col md:flex-row justify-between mb-2">
              <h3 className="text-lg">
                {exp.exp_organization || "------"}
              </h3>
              {exp.exp_letter?.file && (
                <a
                  download
                  className="text-sm opacity-60 flex gap-2 items-center no-underline text-black"
                  href={exp.exp_letter.file}
                >
                  Experience Letter <FiDownload />
                </a>
              )}
            </div>
            <div className="flex flex-col md:flex-row">
              <div className="md:w-[250px] mb-3 md:mb-0">
                <div className="text-lg opacity-80">
                  {exp.exp_designation || "------"}
                </div>
                <div className="opacity-80">
                  {exp.exp_start_date || "00/00/0000"} - {exp.exp_end_date || "00/00/0000"}
                </div>
              </div>
              <div className="md:w-[calc(100%-250px)] opacity-70">
                {exp.exp_description || "--------"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Experience;
