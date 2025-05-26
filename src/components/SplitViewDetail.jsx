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
  dataConfig = { title: "", description: "", className: "" },
  renderConfig = { title: "", description: "", className: "" },
  data = [],
}) => {
  const [selectedItem, setSelectedItem] = useState(
    data && Array.isArray(data) && data?.length > 0 ? data[0] : null
  );
  return (
    <>
      <div className="flex gap-4">
        <div className={`w-25 ${dataConfig?.className || ""}`}>
          <Card>
            <CardTitle className="p-3 pb-1 text-lg text-neutral-1100">
              {dataConfig?.title}
            </CardTitle>
            <CardDescription className="px-3 pb-3 text-neutral-800">
              {dataConfig?.description}
            </CardDescription>
            <CardContent className="px-3">
              {data && Array.isArray(data) && data.length > 0
                ? data?.map((item, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedItem(item)}
                      className={`p-2 my-2 cursor-pointer border-b hover:bg-gray-100 ${
                        selectedItem?.id === item?.id ? "bg-gray-200" : ""
                      }`}
                    >
                      {item?.title}
                    </div>
                  ))
                : <div className="text-sm">"No data to display"</div>}
            </CardContent>
          </Card>
        </div>
        <div className={`w-full min-h-full ${renderConfig?.className || ""}`}>
          <Card className='h-full'>
            <CardTitle className="p-3 pb-1 text-lg text-neutral-1100">
              {renderConfig?.title}
            </CardTitle>
            <CardDescription className="px-3 pb-3 text-neutral-800">
              {renderConfig?.description}
            </CardDescription>
            <CardContent className="px-3">
              {selectedItem ? selectedItem?.content : "No data to display"}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default SplitViewDetail;
