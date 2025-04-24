import React, { useEffect } from "react";

const ViewOrganization = ({ data }) => {
  useEffect(() => {
    // Debug: Log the data structure to see what's available
    console.log("Organization data structure:", data);
  }, [data]);

  const renderField = (label, value) => (
    <div className="flex flex-col">
      <div className="mb-2 text-sm font-medium text-neutral-900">{label}</div>
      <div className="leading-5 text-neutral-1200">{value || "N/A"}</div>
    </div>
  );

  // Helper function to get name values considering various data structures
  const getDisplayValue = (value, idField, displayOptions) => {
    if (!value) return "N/A";
    
    // If value is already a string and not a numeric ID
    if (typeof value === 'string' && isNaN(parseInt(value))) {
      return value;
    }
    
    // Check for possible name fields in the data
    for (const option of displayOptions) {
      if (data && data[option] !== undefined) {
        return data[option];
      }
    }
    
    // Return the original value if no better option found
    return value;
  };

  return (
    <div className="space-y-6">
      {/* Main Office Section */}
      <div className="overflow-hidden bg-white rounded-md shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-medium text-plum-1100">Main Office Information</h2>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-3 gap-x-6 gap-y-8">
            {renderField("Company Title", data?.name)}
            {renderField("Company's Legal Name", data?.legal_name)}
            {renderField("Company Description", data?.companyDescription)}
            {renderField("Licensing Authority", data?.licensing_authority)}
            {renderField("Licensing Number", data?.registration_number)}
            {renderField("Timezone", data?.time_zone)}
            {renderField("Date Format", data?.date_format)}
            {renderField("Currency", data?.currency)}
            {renderField("Payroll Starting Date", data?.payroll_start_date)}
          </div>
        </div>
      </div>

      {/* Address Info Section */}
      <div className="overflow-hidden bg-white rounded-md shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-medium text-plum-1100">Address Information</h2>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-3 gap-x-6 gap-y-8">
            {renderField("Country", getDisplayValue(data?.country, 'country', ['country_name', 'countryName', 'countryLabel']))}
            {renderField("State", getDisplayValue(data?.state, 'state', ['state_name', 'stateName', 'stateLabel']))}
            {renderField("City", getDisplayValue(data?.city, 'city', ['city_name', 'cityName', 'cityLabel']))}
            {renderField("Zip/Postal Code", data?.po_box)}
            {renderField("Address", data?.address)}
          </div>
        </div>
      </div>

      {/* Contact Info Section */}
      <div className="overflow-hidden bg-white rounded-md shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-medium text-plum-1100">Contact Information</h2>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-3 gap-x-6 gap-y-8">
            {renderField("Official Website", data?.website)}
            {renderField("Official Contact Person", data?.contact_person)}
            {renderField("Office Contact Number", data?.phone_number)}
            {renderField("Official Email", data?.email)}
          </div>
        </div>
      </div>

      {/* Logo display if available */}
      {data?.logo && (
        <div className="overflow-hidden bg-white rounded-md shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-xl font-medium text-plum-1100">Company Logo</h2>
          </div>
          
          <div className="flex justify-center p-6">
            <img 
              src={data.logo} 
              alt="Company Logo" 
              className="object-contain max-h-40"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewOrganization;
