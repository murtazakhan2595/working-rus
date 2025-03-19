import { DetailBox } from "components/SheetCardExtension";
import { DetailCard } from "components/SheetCardExtension";
import SheetComponent from "components/ui/SheetComponent";

const ViewOnboarding = ({ isOpen, setIsOpen, data }) => {
  const formSheetData = {
    triggerText: null,
    title: "View Document Details",
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
      <DetailCard detailCardTitle="Document Details" date={data?.created_at}>
        <DetailBox label="Document Name" value={data?.name} />
      </DetailCard>
    </SheetComponent>
  );
};

export default ViewOnboarding;
