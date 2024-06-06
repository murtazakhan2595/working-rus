import React from "react";
import { CiEdit } from "react-icons/ci";

const IdentificationDetails = ({ identificationDetails,isEditable }) => {

  return (
    <div className="bg-white shadow border w-full rounded-lg p-6 mb-6">
      <div className="flex justify-between">
        <h2 className="text-xl">Identification Details</h2>
        {isEditable &&
          <div className="flex gap-4 items-center">
          <CiEdit className="text-2xl cursor-pointer opacity-80" />
        </div>
        }
      </div>
      <hr />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-4">
        {identificationDetails.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            <h3 className="text-lg font-semibold mb-2">{section.title}</h3>
            {section.fields.map((field, fieldIndex) => (
              <div className="flex justify-between mb-2" key={fieldIndex}>
                <div className="opacity-60 w-1/2">{field.title}</div>
                <div className="w-1/2">{field.data || "-----"}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default IdentificationDetails;
