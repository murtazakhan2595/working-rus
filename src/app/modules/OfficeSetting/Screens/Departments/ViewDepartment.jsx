import { DetailBox } from "components/SheetCardExtension";
import { DetailCard } from "components/SheetCardExtension";
import SheetComponent from "components/ui/SheetComponent";

const ViewDepartment = ({ isOpen, setIsOpen, data }) => {
  const formSheetData = {
    triggerText: null,
    title: "View Department",
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
      <DetailCard detailCardTitle="Department Details" date={data?.created_at} dateTitle="Created At">
        <DetailBox label="Name" value={data?.name} />
        <DetailBox label="Description" value={data?.description} />
        <DetailBox label="Organization" value={data?.organization} />
        <DetailBox label="Parent Department" value={data?.parent_department} />
      </DetailCard>
    </SheetComponent>
  );
};

export default ViewDepartment;
