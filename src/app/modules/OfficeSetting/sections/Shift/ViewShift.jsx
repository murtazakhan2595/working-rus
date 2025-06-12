import React from "react";
import { NavigationSheetComponent } from "components";
import { DetailContent } from "components";
import AddShiftForm from "./AddShiftForm";
import useUserOrganization from "app/hooks/useUserOrganization";
import { getShiftById } from "app/hooks/general"; // Adjust path as needed
import { Clock } from "lucide-react";

const formatTime = (isoString) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

const TimeDisplay = ({ time }) => (
  <div className="flex items-center space-x-2">
    <Clock className="w-4 h-4 text-gray-400" />
    <span className="font-medium text-gray-700">{time}</span>
  </div>
);

const ViewShift = ({ 
  isOpen, 
  setIsOpen, 
  data, 
  reload = () => {},
  ShiftList = []
}) => {
  const userOrganization = useUserOrganization();

  // Define the fields to display
  const fields = [
    {
      title: "Shift Details", 
      field: [
        { key: "id", label: "ID" },
        { key: "name", label: "Shift Name" },
        {key: "type", label: "Type"},
        { key: "starttime", label: "Start Time" },
        { key: "endtime", label: "End Time" },
      
        // Add more fields as needed
      ],
    },
  ];

  // Fetch department data by ID
  const fetchData = async (id, isMounted) => {
    console.log("Fetching department with ID:", id); // Debug
    try {
      const response = await getShiftById(id);
      console.log("API response:", response); // Debug
      if (isMounted) {
        return response;
      }
    } catch (error) {
      console.error("Error fetching shift:", error);
    }
  };

  return (
    <NavigationSheetComponent
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="Shift Detail"
      currentItem_Id={data?.id}
      dataList={ShiftList}
      reloadData={reload}
      editComponent={AddShiftForm}
      apiEndpoint={`/shift/${data?.id}/`}
      fetchCurrentItemDetails={fetchData}
      deleteItemName="name"
      editTooltip="Edit Shift"
      deleteTooltip="Delete Shift"
      additionalEditProps={{ userOrganization }}
    >
      <DetailContent
        title="Shift Details"
        fields={fields}
      />
    </NavigationSheetComponent>
  );
};

export default ViewShift;
