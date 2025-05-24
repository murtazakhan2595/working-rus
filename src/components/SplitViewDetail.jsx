import React, { useState } from "react";
import { Header, SheetUI, TableCustom, StatusLabel } from "components";
import { Card } from "components/ui/card";
import { CardContent } from "components/ui/card";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { ApprovalHierarchyRequestType } from "data/Data";
import { Button } from "components/ui/button";
import { FilterInput } from "components/FormControl";
import { DetailBox } from "components/SheetCardExtension";
import { DesignationName } from "utils/getValuesFromTables";
import { SwitchInput } from "components/FormControl";
import { CardDescription, CardTitle } from "components/ui/card";
const SplitViewDetail = ({
  items,
  renderDetail,
  dataConfig = { title: "", description: "", data: [] },
  data,
}) => {
  const [selectedItem, setSelectedItem] = useState(null);
  return (
    <>
      <Card>
        <CardTitle>{dataConfig.title}</CardTitle>
        <CardDescription>{dataConfig.description}</CardDescription>
        <CardContent>
          {dataConfig?.data?.map((item, index) => (
            <div
              key={index}
              onClick={() => setSelectedItem(item)}
              className={`p-4 cursor-pointer border-b hover:bg-gray-100 ${
                selectedItem === item ? "bg-gray-200 font-semibold" : ""
              }`}
            >
              {item.title}
            </div>
          ))}
        </CardContent>
      </Card>
      <div className="flex border rounded-xl overflow-hidden h-full">
        {/* Left Column (List) */}
        <div className="w-1/3 border-r bg-gray-50 overflow-y-auto">
          {items.map((item, index) => (
            <div
              key={index}
              onClick={() => setSelectedItem(item)}
              className={`p-4 cursor-pointer border-b hover:bg-gray-100 ${
                selectedItem === item ? "bg-gray-200 font-semibold" : ""
              }`}
            >
              {item.title}
            </div>
          ))}
        </div>

        {/* Right Column (Detail View) */}
        <div className="w-2/3 p-6 overflow-y-auto">
          {selectedItem ? (
            renderDetail(selectedItem)
          ) : (
            <div className="text-gray-500 italic">
              Select a record to view details
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SplitViewDetail;
