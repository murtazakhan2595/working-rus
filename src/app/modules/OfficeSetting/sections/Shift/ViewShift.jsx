import { DetailBox } from "components/SheetCardExtension";
import { DetailCard } from "components/SheetCardExtension";
import SheetComponent from "components/ui/SheetComponent";

const ViewShift = ({ isOpen, setIsOpen, data }) => {
  const formSheetData = {
    triggerText: null,
    title: "View Shift Details",
    description: null,
    footer: null,
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
        <DetailBox label="Start Time" value={data?.starttime} />
        <DetailBox label="End Time" value={data?.endtime} />
      </DetailCard>
    </SheetComponent>
  );
};

export default ViewShift;
