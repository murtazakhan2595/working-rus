import { useEffect, useState } from "react";
import SheetComponent from "../../../../components/ui/SheetComponent";
import EmployeeDataInfo from "app/modules/payroll/Sections/EmployeeDataInfo";
import moment from "moment";
import { Button } from "components/ui/button";
import { filebase64Download, getFileSizeInKB } from "utils/fileUtils";
import AttachmentUI from "components/ui/AttachmentUI";
import statusApprovedIcon from "assets/images/status-approved.png";
import statusPendingIcon from "assets/images/status-pending.svg";
import statusRejectedIcon from "assets/images/status-rejected.svg";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getAttachmentById } from "app/hooks/assets"; // Assuming similar function exists for assets
import { requestAsset } from "app/hooks/assets"; // Assuming this function exists
import { DetailBox, DetailCard } from "components/SheetCardExtension";

const AssetRequestViewSheet = ({
  request, // Updated from assetRequest to match what's being passed
  isOpen,
  setIsOpen,
  isMyRequest = false,
  reload,
}) => {
  // For compatibility with the existing prop structure
  const assetRequest = request;
  const [attachments, setAttachments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      console.log("assetRequest", assetRequest);
      // Handle attachments if they exist in the asset
      if (
        assetRequest?.asset?.attachments &&
        assetRequest.asset.attachments.length > 0
      ) {
        const validAttachments = assetRequest.asset.attachments.filter(
          (att) => att.attachment !== null
        );
        setAttachments(validAttachments);
      }
    };

    if (assetRequest) {
      fetchData();
    }
  }, [assetRequest]);

  const userProfile = useSelector((state) => state.user.userProfile);

  // Only show approval buttons for admin/manager roles and when status is Pending
  const showButtons =
    !isMyRequest &&
    assetRequest?.asset_status === "Pending" &&
    (userProfile.role === 2 ||
      userProfile.role === 3 ||
      userProfile.role === 1);

  const detailItems = [
    {
      label: "Asset Name",
      value: assetRequest?.asset?.asset_name || assetRequest?.asset_name,
    },
    {
      label: "Asset Type",
      value: assetRequest?.asset?.asset_type || "Not specified",
    },
    {
      label: "Serial Number",
      value: assetRequest?.asset?.asset_serial_number || "Not specified",
    },
    {
      label: "Request Date",
      value: moment(assetRequest?.created_at).format("MMM D, YYYY"),
    },
    {
      label: "Assigned Date",
      value: assetRequest?.asset_assigned_date
        ? moment(assetRequest?.asset_assigned_date).format("MMM D, YYYY")
        : "Not assigned yet",
    },
    assetRequest?.asset_return_date && {
      label: "Return Date",
      value: moment(assetRequest?.asset_return_date).format("MMM D, YYYY"),
    },
    {
      label: "Reason",
      value: assetRequest?.reason || "No reason provided",
    },
    assetRequest?.additional_notes && {
      label: "Additional Notes",
      value: assetRequest?.additional_notes,
    },
  ].filter(Boolean); // Remove undefined items

  const approvalSteps = [
    {
      icon:
        assetRequest?.asset_status === "Approved" ||
        assetRequest?.asset_status === "Accepted"
          ? statusApprovedIcon
          : assetRequest?.asset_status === "Rejected" ||
            assetRequest?.asset_status === "Declined"
          ? statusRejectedIcon
          : statusPendingIcon,
      text: "Request Approval",
    },
  ];

  const formSheetData = {
    triggerText: null,
    title: "Asset Request Details",
    description: null,
    footer: null,
  };

  const handleStatusChange = async (status) => {
    console.log("handle status change", status, assetRequest);

    if (assetRequest?.asset_status !== "Pending") {
      return;
    }

    try {
      const updatedRequest = {
        ...assetRequest,
        asset_status: status,
        asset_assigned_by: userProfile.id,
      };

      const response = await requestAsset(updatedRequest);

      if (response) {
        toast.success("Asset request updated successfully");
        setIsOpen(false);
        reload();
      } else {
        toast.error("Error updating asset request");
      }
    } catch (error) {
      console.error("Error updating request:", error);
      toast.error("Error updating request: " + error.message);
    }
  };

  return (
    <div>
      <SheetComponent
        {...formSheetData}
        contentClassName="custom-sheet-width"
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        width="600px"
      >
        {/* Employee Information Section */}
        <EmployeeDataInfo
          name={`${assetRequest?.employee?.first_name || ""} ${
            assetRequest?.employee?.last_name || ""
          }`}
          email={assetRequest?.employee?.work_email}
          src={assetRequest?.employee?.profile_picture?.file}
          id={assetRequest?.employee?.id}
        />

        {/* Details Section */}
        <DetailCard
          date={assetRequest?.created_at}
          detailCardTitle="Request Details"
        >
          <div className="flex flex-col flex-1 shrink justify-center pr-11 w-full basis-0 min-w-[240px]">
            {detailItems.map((item, index) => (
              <DetailBox key={index} label={item?.label} value={item?.value} />
            ))}

            {/* Attachments Section */}
            {/* Attachments Section */}
            {attachments && attachments.length > 0 && (
              <div className="flex items-center max-w-full gap-4 mt-4">
                <div className="flex flex-col leading-none min-w-[88px] text-neutral-900 w-[132px]">
                  <div>Attachments</div>
                </div>
                <div className="flex-1 shrink leading-5 basis-0 text-neutral-800">
                  {attachments.map(
                    (attachment, index) =>
                      attachment.attachment && (
                        <AttachmentUI
                          key={attachment.id || index}
                          id={attachment.id}
                          attachment={attachment.attachment}
                          name={attachment.attachment.split("/").pop()}
                          viewOnly={true}
                          removeFile={() => {}} // Empty function since it's view only
                        />
                      )
                  )}
                </div>
              </div>
            )}
          </div>
        </DetailCard>

        {/* Approval Status Section */}
        <DetailCard detailCardTitle="Request Status">
          <section className="flex relative flex-col max-w-[382px] mt-3">
            <div className="flex absolute -bottom-0.5 z-0 justify-center items-start w-6 h-[150px] left-[5px] min-h-[150px]" />
            {approvalSteps.map((step, index) => (
              <div
                key={index}
                className="z-0 flex items-center justify-between w-full gap-10"
              >
                <div className="flex gap-4 self-stretch my-auto w-[194px]">
                  <div className="flex justify-center items-center px-1 bg-white h-[33px] w-[33px]">
                    <img
                      loading="lazy"
                      src={step.icon}
                      alt=""
                      className="object-contain self-stretch my-auto aspect-square w-[25px]"
                    />
                  </div>
                  <div className="py-0.5 my-auto text-xs leading-loose text-[#6B7280] min-h-[24px]">
                    {step.text}
                  </div>
                </div>
                {step.time && (
                  <div className="self-stretch py-0.5 my-auto text-xs leading-loose text-[#6B7280]">
                    {step.time}
                  </div>
                )}
              </div>
            ))}
          </section>
        </DetailCard>

        {/* Approval Buttons */}
        {!isMyRequest && showButtons && (
          <div className="flex flex-col justify-end gap-4 pt-6 md:flex-row lg:flex-row xl:flex-row">
            <Button
              variant="outline"
              type="button"
              size="lg"
              onClick={() => {
                handleStatusChange("Rejected");
              }}
            >
              Reject
            </Button>
            <Button
              type="button"
              size="lg"
              variant="default"
              onClick={() => {
                handleStatusChange("Accepted");
              }}
            >
              Accept
            </Button>
          </div>
        )}

        {/* Close Button for non-pending or my requests */}
        {(isMyRequest || assetRequest?.asset_status !== "Pending") && (
          <div className="flex justify-end pt-6">
            <Button variant="outline" type="button" size="lg" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </div>
        )}
      </SheetComponent>
    </div>
  );
};

export default AssetRequestViewSheet;
