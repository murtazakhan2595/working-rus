import { Header } from "components";
import { Card } from "components/ui/card";
import React, { useEffect, useState } from "react";
// import AddOrganizationForm from "../sections/AddOrganizationForm";
import TableCustom from "components/CustomTable";
import OrganizationAction from "../sections/Organizations/OrganizationAction";
import AddOrganization from "../sections/Organizations/AddOrganization";
import { getWorkingHours } from "app/hooks/general";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "src/@/components/ui/tabs";
import Departments from "./Departments";
import Designations from "./Designations";
import AddDepartment from "../sections/Departments/AddDepartment";
import { getOrganizationList } from "app/hooks/general";
import { CardContent } from "components/ui/card";
import AddDesignation from "../sections/Designations/AddDesignation";
import WorkingHours from "./WorkingHours";
import Shift from "../sections/Shift/Shift";
import { PageLoader } from "components";

const OfficeSetting = () => {
  const [data, setData] = useState(null);
  const [dataShift, setDataShift] = useState(null);
  const [edit, setEdit] = useState(false);
  const [editData, setEditData] = useState(null);
  const [activeTab, setActiveTab] = useState("offices");
  const [loading, setLoading] = useState(true);

  const getOrganization = async () => {
    try {
      setLoading(true);
      const response = await getOrganizationList(true);
      if (response) {
        setData(response);
      }
      setLoading(false);
    } catch (error) {
      console.log("ERROR", error);
    }
  };
  const fetchShifts = async () => {
      try {
        setLoading(true);
        const response = await getWorkingHours();
        if (response?.results) {
          const formattedData = response.results.map((item) => ({
            ...item,
          }));
          setDataShift(formattedData);
        }
        setLoading(false);
      } catch (error) {
        console.log(error, "ERROR");
      }
    };

  const handleSubmit = (values) => {
    console.log(values, "FORM SUBMMTIED VALUES");
  };

  useEffect(() => {
    const fetchData = async () => {
      getOrganization();
      fetchShifts()
    }
    fetchData()
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
          reload={getOrganization}
        />
      ),
    },
  ];

  const tabsData = [
    { value: "offices", label: "Offices" },
    { value: "department", label: "Department" },
    { value: "designation", label: "Designation" },
    { value: "working-hours", label: "Working Hours" },
  ];

  console.log("edit, editData", edit, editData);
  console.log(fetchShifts, "fetchShifts in parent");

  return (
    <div>
      {loading ? (
        <PageLoader />
      ) : (
        <div className="flex flex-col gap-4 profile-management">
          <Header
            content={
              activeTab === "offices" ? (
                <AddOrganization reload={getOrganization} />
              ) : activeTab === "department" ? (
                <AddDepartment />
              ) : activeTab === "designation" ? (
                <AddDesignation />
              ) : (
                <Shift reload={fetchShifts} />
              )
            }
          />
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
                <CardContent>
                  <TableCustom
                    columns={columns}
                    data={data?.results || []}
                    // tableOptions={tableOptions}
                    dataTotalSize={data?.length || 0}
                    pagination={true}
                    itemsPerPage={10}
                    className="organization-table"
                  />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="department">
              <Departments />
            </TabsContent>
            <TabsContent value="designation">
              <Designations />
            </TabsContent>
            <TabsContent value="working-hours">
              <WorkingHours data={dataShift} reload={fetchShifts} />
            </TabsContent>
          </Tabs>
          {activeTab === "offices" && edit && (
            <AddOrganization
              reload={getOrganization}
              edit={edit}
              editData={editData}
              setEdit={setEdit}
              setEditData={setEditData}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default OfficeSetting;
