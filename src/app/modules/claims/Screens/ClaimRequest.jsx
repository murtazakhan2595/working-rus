import React, { useEffect, useState } from "react";

import Header from "../../../../components/Header.jsx";
import { FilterInput } from "components/form-control.jsx";
import { Card, CardContent, CardHeader } from "../../../../components/ui/card.jsx";
import CustomTable from "components/CustomTable";
import { ClaimRequestColumns } from "app/utils/Types/TableColumns.jsx";
import ReimbursmentDetailsSheet from "../Sections/ReimbursmentDetailsSheet.jsx";
import ReimbursmentDetailsRequest from "../Sections/ReimbursmentDetailsRequest.jsx";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const claimRequests = [
  {
    id: 1,
    employee_id: 1,
    employee_name: "John Doe",
    department_name: "Finance",
    position: "Accountant",
    expense_type: "Travel",
    date_of_expense: "2024-09-01",
    amount: "$500",
    receipt: "Receipt_001.pdf",
    status: "Approved",
  },
  {
    id: 2,
    employee_id: 2,
    employee_name: "Jane Smith",
    department_name: "HR",
    position: "HR Manager",
    expense_type: "Training",
    date_of_expense: "2024-09-02",
    amount: "$300",
    receipt: "Receipt_002.pdf",
    status: "Pending",
  },
  {
    id: 3,
    employee_id: 3,
    employee_name: "Michael Brown",
    department_name: "IT",
    position: "Software Engineer",
    expense_type: "Equipment",
    date_of_expense: "2024-09-03",
    amount: "$1000",
    receipt: "Receipt_003.pdf",
    status: "Rejected",
  },
  {
    id: 4,
    employee_id: 4,
    employee_name: "Emily Clark",
    department_name: "Marketing",
    position: "Marketing Coordinator",
    expense_type: "Advertisement",
    date_of_expense: "2024-09-04",
    amount: "$700",
    receipt: "Receipt_004.pdf",
    status: "Approved",
  },
];

const ClaimRequest = () => {
  const [filterData, setFilterData] = useState({});
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedClaimRequest, setSelectedClaimRequest] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const pathname = location.pathname;

  const onPageChange = (name, value) => {
    setOptions((prevOptions) => ({ ...prevOptions, [name]: value }));
  };
  const userProfile = useSelector((state) => state.user.userProfile);


  const tableOptions = {
    page: options.page,
    sizePerPage: options.sizePerPage,
    onPageChange: onPageChange,
    onRowClick: (row) => {
      setSelectedClaimRequest(row);
      setIsOpen(true);
    },
  };

  const handleFilterChange = (filterName, filterValue) => {
    onPageChange("page", 1);
    setFilterData((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      if (filterValue === "") {
        delete updatedFilters[filterName];
      } else {
        updatedFilters[filterName] = filterValue;
      }
      return updatedFilters;
    });
  };
  const isMyClaims = pathname === "/my-claims";

  return (
    <div className="flex flex-col gap-4 salary-startup">
      {selectedClaimRequest && (
        <ReimbursmentDetailsSheet
          claimRequest={selectedClaimRequest}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
      )}
      <Header content={isMyClaims ? <ReimbursmentDetailsRequest /> : null} />
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="h-[47px] flex-col justify-center items-start inline-flex">
              <div className="flex-col justify-start items-start flex">
                <div className="self-stretch text-[#ab4aba] text-2xl font-medium font-['Inter'] leading-normal">
                  {isMyClaims ? "Reimbursment Requests" : "Requests"}
                </div>
              </div>
              <div className="pt-1.5 flex-col justify-start items-start flex">
                <div className="flex-col justify-start items-start flex">
                  <div className="self-stretch text-[#8b8d98] text-sm font-normal font-['Inter'] leading-[16.80px]">
                   {isMyClaims?"Your reimburment request status is displyed": " All employee reimbursements are displayed"}
                  </div>
                </div>
              </div>
            </div>
            <FilterInput
              filters={[
                {
                  type: "select-one",
                  option: [],
                  name: "department_name",
                  placeholder: "Department",
                },
                {
                  type: "select-two",
                  option: [],
                  name: "salary_type",
                  placeholder: "Salary Type",
                },
              ]}
              onChange={handleFilterChange}
            />
          </div>
        </CardHeader>
        <CardContent>
          <CustomTable
            data={claimRequests}
            columns={ClaimRequestColumns}
            pagination={true}
            dataTotalSize={0}
            tableOptions={tableOptions}
            selectable={true}
            setSelectedRows={setSelectedRows}
            selectedRows={selectedRows}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ClaimRequest;
