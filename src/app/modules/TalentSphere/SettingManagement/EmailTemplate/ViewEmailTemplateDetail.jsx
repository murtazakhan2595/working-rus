import React from "react";
import { NavigationSheetComponent } from "components";
import { DetailContent, TextUI } from "components";
import { getEmailTemplateData } from "app/hooks/talentSphere"; // Adjust path as needed
import { AddUpdateEmailTemplateForm } from "app/modules/TalentSphere";
import { FormatID } from 'utils/getValuesFromTables';
import { RecruitmentEmailTemplateType } from "data/Data";

const ViewEmailTemplateDetail = ({
  isOpen,
  setIsOpen,
  currentId,
  reloadData = () => { },
  DataList = [],
}) => {
  // Define the fields to display
  const fields = [
    {
      title: "Template Details",
      footerTitle: "Created At",
      footerField: "created_on",
      field: [
        {
          key: "id",
          label: "Id",
          formatter: (cell) => <FormatID value={cell} prefix={"ET-"} />,
        },
        { key: "name", label: "Template Name", },
        {
          key: "template_type",
          label: "Templaye Type",
          formatter: (cell) => {
            return (RecruitmentEmailTemplateType.find(obj => obj.value === cell) || {}).label || '--';
          },
        },
        { key: "subject", label: "Template Subject" },
        { key: "signature", label: "Template Signature" },
      ],
    },
    {
      title: "Template Body",
      field: [
        {
          key: "body",
          formatter: (cell) => <TextUI text={cell} isHTMLText={true}/>
        },
      ],
    },
  ];

  // Fetch department data by ID
  const fetchData = async (id, isMounted) => {
    try {
      if (id) {
        const response = await getEmailTemplateData(id);
        if (isMounted) {
          return response;
        }
      }
    } catch (error) {
      console.error("Error fetching department:", error);
    }
  };

  return (
    <NavigationSheetComponent
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="Email Template Detail"
      currentItem_Id={currentId}
      dataList={DataList}
      reloadData={reloadData}
      editComponent={AddUpdateEmailTemplateForm}
      apiEndpoint={`/recruitment-email-templates/$id/`}
      fetchCurrentItemDetails={fetchData}
      deleteItemName="name"
      editTooltip="Edit Template"
      deleteTooltip="Delete Templaye"
    >
      <DetailContent fields={fields} />
    </NavigationSheetComponent>
  );
};

export default ViewEmailTemplateDetail;      
