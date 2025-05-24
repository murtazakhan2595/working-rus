import React from "react";
import { NavigationSheetComponent, DetailContent } from "components";
import AddShiftForm from "./AddShiftForm";
import moment from "moment";

const ViewShift = ({ 
  isOpen, 
  setIsOpen, 
  data, 
  reload = () => {}, 
  ShiftList = [] 
}) => {
  // Helper function to format time
  const formatTime = (utcTime) => {
    return utcTime ? moment.utc(utcTime).local().format("hh:mm A") : "N/A";
  };

  // Define the fields to display
  const fields = [
    { key: "name", label: "Name" },
    { key: "type", label: "Shift Type" },
    { key: "starttime", label: "Start Time", formatter: formatTime },
    { key: "endtime", label: "End Time", formatter: formatTime }
  ];

  return (
    <NavigationSheetComponent
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="Shift Detail"
      data={data}
      dataList={ShiftList}
      reload={reload}
      editComponent={AddShiftForm}
      deleteEndpoint={`/shift/${data?.id}`}
      refreshEndpoint="/shift"
      deleteItemName="name"
      editTooltip="Edit Shift"
      deleteTooltip="Delete Shift"
    >
      <DetailContent
        title="Shift Details"
        fields={fields}
      />
    </NavigationSheetComponent>
  );
};

export default ViewShift;
