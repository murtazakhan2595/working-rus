import React, { useEffect, useState } from "react";
import {
  InternalTransferColumns,
  EmployeeTransferDetails,
} from "app/modules/EmployeeTranfer/Sections";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "src/@/components/ui/tabs";
import { TableCustom } from "components";
import { useSelector } from "react-redux";

const innerTabClassName =
  "shadow-none border-transparent mr-4 border-b data-[state=active]:border-plum-1100 w-28 data-[state=active]:text-primary-1100 rounded-none data-[state-active]:font-medium";

const EmployeeInternalTranfer = ({
  setActiveTab = () => {},
  activeTab = "Requests",
  TabList = [],
  EmployeesTransferData = { results: [], count: 0 },
  reloadData = () => {},
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [filterData, setFilterData] = useState({});
  const [OpenTransferDetailID, setOpenTransferDetailID] = useState(false);
  const [totalEmployee, setTotalEmployee] = useState(0);
  const [activeEmployee, setActiveEmployee] = useState(0);
  const [totalManagers, setTotalManagers] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const Departments = useSelector((state) => state.common.departments);
  const [ordering, setOrdering] = useState("-id");

  const onPageChange = (name, value) => {
    setOptions((prevOptions) => ({ ...prevOptions, [name]: value }));
  };

  const tableOptions = {
    page: options.page,
    sizePerPage: options.sizePerPage,
    onRowClick: (row) => {
      setOpenTransferDetailID(row.id);
    },
    onPageChange: onPageChange,
    onSortChange: (sortName) => {
      setOrdering(sortName);
    },
  };

  return (
    <>
      {" "}
      <Tabs
        defaultValue="Requests"
        className="w-full"
        onValueChange={(tab) => {
          setActiveTab(tab);
        }}
        value={activeTab}
      >
        <div className="flex flex-col items-start justify-between lg:flex-row md:flex-row xl:flex-row">
          <TabsList className="flex items-center justify-center mb-4">
            {TabList.map((tab) => (
              <TabsTrigger key={tab} value={tab} className={innerTabClassName}>
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        <TableCustom
          data={EmployeesTransferData.results}
          columns={InternalTransferColumns}
          pagination={true}
          dataTotalSize={EmployeesTransferData.count || 0}
          tableOptions={tableOptions}
        />
      </Tabs>
      {OpenTransferDetailID && (
        <EmployeeTransferDetails
          transferID={OpenTransferDetailID}
          isOpen={!!OpenTransferDetailID}
          setIsOpen={() => {
            setOpenTransferDetailID(null);
          }}
          TransferList={EmployeesTransferData.results}
          reloadData={reloadData}
        />
      )}
    </>
  );
};

export default EmployeeInternalTranfer;
