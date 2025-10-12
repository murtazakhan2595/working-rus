import React, { useEffect, useState } from "react";
import {
  CardContent,
  Card,
  CardDescription,
  CardTitle,
} from "components/ui/card";
import { PageLoader } from "components";
const SplitViewDetail = ({
  dataConfig = { title: "", description: "", className: "" },
  renderConfig = { title: "", description: "", className: "" },
  data = [],
  uniqueKey='id',
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(
    data && Array.isArray(data) && data?.length > 0 ? data[0] : null
  );
  useEffect(() => {
  let isMounted = true;
  setIsLoading(true);

  // Safely update selected item when 'data' changes
  setSelectedItem((prevSelected) => {
    if (!data || data.length === 0) return null;

    const prevId = prevSelected?.[uniqueKey];

    // If no valid ID in previously selected item, default to the first item
    if (prevId == null) {
      return data[0];
    }

    // Find the matching item in the new data list
    const matchedItem = data.find((item) => item.id === prevId);

    // If match found, return it, otherwise fallback to first item
    return matchedItem || data[0];
  });

  setIsLoading(false);

  return () => {
    isMounted = false;
  };
}, [data]);

  return isLoading ? (
    <PageLoader />
  ) : (
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
            {data && Array.isArray(data) && data.length > 0 ? (
              data?.map((item, index) => (
                <div
                  key={`${item?.title}-${index}`}
                  onClick={() => setSelectedItem(item)}
                  className={`p-2 my-2 cursor-pointer border-b hover:bg-gray-100 ${
                    selectedItem?.[uniqueKey] === item?.[uniqueKey] ? "bg-gray-200" : ""
                  }`}
                >
                  {item?.title}
                </div>
              ))
            ) : (
              <div className="text-sm">"No data to display"</div>
            )}
          </CardContent>
        </Card>
      </div>
      <div className={`w-full min-h-full ${renderConfig?.className || ""}`}>
        <Card className="h-full">
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
  );
};

export default SplitViewDetail;
