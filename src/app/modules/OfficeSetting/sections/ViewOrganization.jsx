import { DetailBox } from "components/SheetCardExtension";
import { DetailCard } from "components/SheetCardExtension";
import SheetComponent from "components/ui/SheetComponent";
import React from "react";

const ViewOrganization = ({ isOpen, setIsOpen, data }) => {
  console.log(data, "DATA");
  const formSheetData = {
    triggerText: null,
    title: "View Organization",
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
      <DetailCard detailCardTitle="Basic Information">
        <DetailBox label="Company Name" value={data?.name} />
        <DetailBox label="Legal Name" value={data?.legal_name} />
        <DetailBox label="Description" value={data?.description} />
        <DetailBox
          label="Licensing Authority"
          value={data?.licensing_authority}
        />
        <DetailBox label="Licensing Number" value={data?.licensing_number} />
        <DetailBox label="Timezone" value={data?.timezone} />
        <DetailBox label="Date Format" value={data?.date_format} />
        <DetailBox label="Currency" value={data?.currency} />
      </DetailCard>

      <DetailCard detailCardTitle="Address">
        <DetailBox label="City" value={data?.city} />
        <DetailBox label="State" value={data?.state} />
        <DetailBox label="Country" value={data?.country} />
        <DetailBox label="Zip/ Postal Code" value={data?.zipcode} />
        <DetailBox label="Address" value={data?.address} />
      </DetailCard>

      <DetailCard detailCardTitle="Contact Information">
        <DetailBox label="Official Website" value={data?.website} />
        <DetailBox label="Office Number (Landline)" value={data?.phone_number} />
        <DetailBox label="Contact Person Number (Mobile)" value={data?.contact_person_number} />
        <DetailBox label="Contact Person Name" value={data?.contact_person} />
        <DetailBox label="Official Email" value={data?.email} />
      </DetailCard>
    </SheetComponent>
  );
};

export default ViewOrganization;
