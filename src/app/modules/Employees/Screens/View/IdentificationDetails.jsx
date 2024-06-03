import React from "react";

const IdentificationDetails = ({ identificationDetails }) => {

  return (
    <div className="bg-white shadow border w-full rounded-lg p-6 mb-6">
      <h2 className="text-xl mb-4">Identification Details</h2>
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
