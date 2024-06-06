import React from "react";
import { FiDownload } from "react-icons/fi";
import { CiEdit } from "react-icons/ci";
import { FiPlus } from "react-icons/fi";

const Certifications = ({ certifications,isEditable }) => {
  return (
    <div className="bg-white shadow border w-full rounded-lg p-4 mb-6">
      <div className="flex justify-between">
        <h2 className="text-xl">Certification and License</h2>
        {isEditable &&
          <div className="flex gap-4 items-center">
          <FiPlus className="text-lg cursor-pointer opacity-80" />
          <CiEdit className="text-2xl cursor-pointer opacity-80" />
        </div>
        }
      </div>
      <hr />
      <div className="py-4 overflow-auto no-scrollbar">
        {certifications?.map((cer, index) => (
          <div key={index} className="w-full flex flex-wrap justify-between mb-7">
            <div>
              <div className="text-lg mb-2">
                {cer.certification_name || "------"}
              </div>
              <div className="text-lg opacity-80">
                {cer.certification_institute || "------"}
              </div>
              <div className="opacity-70">
                {cer.completion_date || "00-00-0000"}{cer.expiry_date &&" - "}
                {cer.expiry_date || ""}
              </div>
            </div>
            <div>
              {cer.certification_body?.file && (
                <a
                  download={cer.certification_body?.name}
                  className="flex items-center gap-x-2 mb-3 text-sm opacity-50 py-2 mt-2 font-semibold border border-black rounded-lg font-opensans px-4 no-underline text-black"
                  href={cer?.certification_body?.file}
                >
                  {" "}
                  Certification <FiDownload />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Certifications;
