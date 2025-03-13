import React from "react";
import { Button } from "components/ui/button";
import moment from "moment";
import { Tag, MapPin, Calendar, Banknote, Info } from "lucide-react";
import AttachmentUI from "components/ui/AttachmentUI"; // Import the AttachmentUI component

const AssetView = ({ assetData, onEdit, onDelete, onClose }) => {
  // Format currency
  const formatCurrency = (value) => {
    return `AED ${parseFloat(value).toFixed(2)}`;
  };

  // Organize asset details into sections
  const assetDetails = [
    { label: "Asset Name", value: assetData.asset_name },
    { label: "Asset Type", value: assetData.asset_type },
    { label: "Serial Number", value: assetData.asset_serial_number },
    { label: "Model", value: assetData.asset_model },
    { label: "Description", value: assetData.asset_description },
  ];

  const purchaseDetails = [
    {
      label: "Purchase Date",
      value: assetData.asset_purchase_date
        ? moment(assetData.asset_purchase_date).format("MMM D, YYYY")
        : "N/A",
      icon: <Calendar size={16} className="text-muted-foreground" />,
    },
    {
      label: "Purchase Price",
      value: formatCurrency(assetData.asset_purchase_price),
      icon: <Banknote size={16} className="text-muted-foreground" />,
    },
    {
      label: "Condition",
      value: assetData.asset_initial_condition,
      icon: <Info size={16} className="text-muted-foreground" />,
    },
    {
      label: "Warranty",
      value: assetData.asset_warranty,
      icon: <Info size={16} className="text-muted-foreground" />,
    },
    {
      label: "Warranty Expiry",
      value: assetData.asset_warranty_expiry
        ? moment(assetData.asset_warranty_expiry).format("MMM D, YYYY")
        : "N/A",
      icon: <Calendar size={16} className="text-muted-foreground" />,
    },
  ];

  const locationDetails = [
    {
      label: "Location",
      value:
        typeof assetData.asset_location === "object"
          ? assetData.asset_location?.name
          : `Location ${assetData.asset_location}`,
      icon: <MapPin size={16} className="text-muted-foreground" />,
    },
    {
      label: "Category",
      value: assetData.asset_type,
      icon: <Tag size={16} className="text-muted-foreground" />,
    },
  ];

  // Helper function to extract filename from URL
  const getFilenameFromUrl = (url) => {
    if (!url) return "Attachment";
    const parts = url.split("/");
    return parts[parts.length - 1];
  };

  return (
    <div className="w-full p-0">
      <div className="flex flex-col">
        <div className="flex-grow">
          <div className="p-0">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Asset Details</h3>
              <div className="flex items-center gap-3">
                <Button
                  onClick={onEdit}
                  className="border bg-white border-[#e8e8ec] text-neutral-1200 text-xs font-semibold font-[inter]"
                >
                  Edit
                </Button>
                <Button
                  onClick={onDelete}
                  className="border bg-white border-[#e8e8ec] text-neutral-1200 text-xs font-semibold font-[inter]"
                >
                  Delete
                </Button>
              </div>
            </div>

            {/* Asset Details Section */}
            <div className="font-[inter] mt-5 flex flex-grow flex-col gap-y-[16px] rounded-lg border border-solid border-zinc-200 text-sm font-medium leading-[1.2] tracking-[0px] ">
              <section className="flex flex-col justify-center p-6 text-sm bg-white">
                <div className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                  Basic Information
                </div>
                <div className="flex w-full mt-3">
                  <div className="flex flex-col flex-1 shrink justify-center pr-11 w-full basis-0 min-w-[240px]">
                    {assetDetails.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center max-w-full gap-4 mt-4"
                      >
                        <div className="flex flex-col leading-none min-w-[88px]  w-[132px]">
                          <div>{item.label}</div>
                        </div>
                        <div className="flex-1 leading-5 text-neutral-900 shrink basis-0 ">
                          {item.value || "N/A"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
              <div className="h-[45px] px-6 pt-[13px] pb-3 bg-zinc-100/50 border-t border-zinc-200 justify-start items-center inline-flex">
                <div className="inline-flex flex-col items-start justify-start grow shrink basis-0">
                  <div>
                    <span className="text-[#8b8d98] text-xs font-medium leading-tight">
                      Created on:
                    </span>
                    <span className="text-[#8b8d98] text-xs font-normal leading-3">
                      {` ${moment(assetData?.created_at).format(
                        "MMMM DD, YYYY"
                      )}`}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Purchase Details Section */}
            <div className="font-[inter] mt-5 flex flex-grow flex-col gap-y-[16px] rounded-lg border border-solid border-zinc-200 text-sm font-medium leading-[1.2] tracking-[0px] ">
              <section className="flex flex-col justify-center p-6 text-sm bg-white">
                <div className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                  Purchase Information
                </div>
                <div className="flex w-full mt-3">
                  <div className="flex flex-col flex-1 shrink justify-center pr-11 w-full basis-0 min-w-[240px]">
                    {purchaseDetails.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center max-w-full gap-4 mt-4"
                      >
                        <div className="flex flex-col leading-none min-w-[88px]  w-[132px]">
                          <div>{item.label}</div>
                        </div>
                        <div className="flex-1 leading-5 text-neutral-900 shrink basis-0  flex items-center gap-2">
                          {item.icon}
                          {item.value || "N/A"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
              <div className="h-[45px] px-6 pt-[13px] pb-3 bg-zinc-100/50 border-t border-zinc-200 justify-start items-center inline-flex">
                <div className="inline-flex flex-col items-start justify-start grow shrink basis-0">
                  <div>
                    <span className="text-[#8b8d98] text-xs font-medium leading-tight">
                      Last updated:
                    </span>
                    <span className="text-[#8b8d98] text-xs font-normal leading-3">
                      {` ${moment(assetData?.updated_at).format(
                        "MMMM DD, YYYY"
                      )}`}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Location Details Section */}
            <div className="font-[inter] mt-5 flex flex-grow flex-col gap-y-[16px] rounded-lg border border-solid border-zinc-200 text-sm font-medium leading-[1.2] tracking-[0px] ">
              <section className="flex flex-col justify-center p-6 text-sm bg-white">
                <div className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                  Location & Category
                </div>
                <div className="flex w-full mt-3">
                  <div className="flex flex-col flex-1 shrink justify-center pr-11 w-full basis-0 min-w-[240px]">
                    {locationDetails.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center max-w-full gap-4 mt-4"
                      >
                        <div className="flex flex-col leading-none min-w-[88px]  w-[132px]">
                          <div>{item.label}</div>
                        </div>
                        <div className="flex-1 leading-5 shrink basis-0 text-neutral-900 flex items-center gap-2">
                          {item.icon}
                          {item.value || "N/A"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </div>

            {/* Notes Section - display only if notes exist */}
            {assetData.asset_notes && (
              <div className="font-[inter] mt-5 flex flex-grow flex-col gap-y-[16px] rounded-lg border border-solid border-zinc-200 text-sm font-medium leading-[1.2] tracking-[0px] ">
                <section className="flex flex-col justify-center p-6 text-sm bg-white">
                  <div className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                    Notes
                  </div>
                  <div className="flex w-full mt-3">
                    <div className="flex flex-col flex-1 shrink justify-center pr-11 w-full basis-0 min-w-[240px]">
                      <div className="mt-2 ">{assetData.asset_notes}</div>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {/* Attachments Section - Now using AttachmentUI component */}
            {assetData.attachments && assetData.attachments.length > 0 && (
              <div className="font-[inter] mt-5 flex flex-grow flex-col gap-y-[16px] rounded-lg border border-solid border-zinc-200 text-sm font-medium leading-[1.2] tracking-[0px] ">
                <section className="flex flex-col justify-center p-6 text-sm bg-white">
                  <div className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                    Attachments
                  </div>
                  <div className="flex w-full mt-3">
                    <div className="flex flex-col flex-1 shrink justify-center w-full basis-0 min-w-[240px]">
                      {assetData.attachments.map((attachmentItem, index) => (
                        <AttachmentUI
                          key={attachmentItem.id}
                          id={attachmentItem.id}
                          attachment={attachmentItem.attachment}
                          name={getFilenameFromUrl(attachmentItem.attachment)}
                          viewOnly={true}
                          removeFile={() => {}} // Empty function since it's view only
                        />
                      ))}
                    </div>
                  </div>
                </section>
              </div>
            )}

            {/* Footer Button */}
            <div className="flex justify-end mt-6">
              <Button variant="outline" size="lg" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetView;
