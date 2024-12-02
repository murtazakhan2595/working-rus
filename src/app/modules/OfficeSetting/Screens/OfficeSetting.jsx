import { Header } from "components";
import { Card } from "components/ui/card";
import React, { useEffect, useState } from "react";
// import AddOrganizationForm from "../sections/AddOrganizationForm";
import TableCustom from "components/CustomTable";
import OrganizationAction from "../sections/OrganizationAction";
import AddOrganization from "../sections/AddOrganization";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "src/@/components/ui/tabs";
import Departments from "./Departments";
import Designations from "./Designations";
import AddDepartment from "../sections/AddDepartment";
import { getOrganizationList } from "app/hooks/general";

const OfficeSetting = () => {
  const [data, setData] = useState(null);
  const [edit, setEdit] = useState(false);
  const [editData, setEditData] = useState(null);
  const [activeTab, setActiveTab] = useState("offices");

  const getOrganization = async () => {
    try {
      const response = await getOrganizationList(true);
      if (response) {
        setData(response);
      }
    } catch (error) {
      console.log("ERROR", error);
    }
  };

  const handleSubmit = (values) => {
    console.log(values, "FORM SUBMMTIED VALUES");
  };

  useEffect(() => {
    getOrganization();
  }, []);

  const columns = [
    {
      dataField: "id",
      text: "ID",
    },
    {
      dataField: "name",
      text: "Organization Name",
    },
    {
      dataField: "licensing_authority",
      text: "Licenseing Authority",
    },
    {
      dataField: "email",
      text: "Email",
    },
    {
      text: "Action",
      formatter: (cell, row) => (
        <OrganizationAction
          setEdit={setEdit}
          setEditData={setEditData}
          data={row}
        />
      ),
    },
  ];

  const tabsData = [
    { value: "offices", label: "Offices" },
    { value: "department", label: "Department" },
    { value: "designation", label: "Designation" },
  ];

  console.log(edit, editData, "EDIT MODE");
  return (
    <div className="flex flex-col gap-4 profile-management">
      <Header content={activeTab === "offices" ? <AddOrganization /> : <AddDepartment/>} />
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        defaultValue="offices"
      >
        <div className="flex justify-start">
          <TabsList className="flex justify-center mb-4">
            {tabsData?.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="data-[state=active]:bg-primary-200 w-28 data-[state=active]:text-primary-1100 rounded-sm data-[state-active]:font-medium"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        <TabsContent value="offices">
          <Card>
            <TableCustom
              columns={columns}
              data={data || []}
              // tableOptions={tableOptions}
              dataTotalSize={data?.length || 0}
              pagination={true}
              itemsPerPage={10}
              className="organization-table"
            />
          </Card>
        </TabsContent>
        <TabsContent value="department">
          <Departments />
        </TabsContent>
        <TabsContent value="designation">
          <Designations />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OfficeSetting;
