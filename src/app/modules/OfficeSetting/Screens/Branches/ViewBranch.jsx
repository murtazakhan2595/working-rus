import { DetailBox } from "components/SheetCardExtension";
import { DetailCard } from "components/SheetCardExtension";
import SheetComponent from "components/ui/SheetComponent";

const ViewDepartment = ({ isOpen, setIsOpen, data }) => {
  const formSheetData = {
    triggerText: null,
    title: "View Branch",
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
      <DetailCard detailCardTitle="Branch Details" date={data?.created_at} dateTitle="Created At">
        <DetailBox label="Id" value={data?.serial_number} />
        <DetailBox label="Name" value={data?.branch_name} />
        <DetailBox label="Branch Number" value={data?.branch_number} />
        <DetailBox label="Address" value={data?.branch_address} />
        {/* <DetailBox label="Parent Department" value={data?.parent_department} /> */}
      </DetailCard>
    </SheetComponent>
  );
};

export default ViewDepartment;
