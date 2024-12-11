import { DetailBox } from "components/SheetCardExtension";
import { DetailCard } from "components/SheetCardExtension";
import SheetComponent from "components/ui/SheetComponent";
import moment from "moment"; // Ensure moment is installed and imported

const ViewShift = ({ isOpen, setIsOpen, data }) => {
  const formSheetData = {
    triggerText: null,
    title: "View Shift Details",
    description: null,
    footer: null,
  };

  // Helper function to format time
  const formatTime = (utcTime) => {
    return utcTime ? moment.utc(utcTime).local().format("hh:mm A") : "N/A";
  };

  return (
    <SheetComponent
      {...formSheetData}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      width="568px"
    >
      <DetailCard detailCardTitle="Shift Details" date={data?.created_at}>
        <DetailBox label="Name" value={data?.name} />
        <DetailBox label="Shift Type" value={data?.type} />
        <DetailBox label="Start Time" value={formatTime(data?.starttime)} />
        <DetailBox label="End Time" value={formatTime(data?.endtime)} />
      </DetailCard>
    </SheetComponent>
  );
};

export default ViewShift;
