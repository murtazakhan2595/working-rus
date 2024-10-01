import React, { useEffect, useState } from "react";

import Header from "../../../../components/Header.jsx";
import { FilterInput } from "components/form-control.jsx";
import { Card, CardContent, CardHeader } from "../../../../components/ui/card.jsx";
import CustomTable from "components/CustomTable";
import { ClaimRequestColumns } from "app/utils/Types/TableColumns.jsx";
import ReimbursmentDetailsSheet from "../Sections/ReimbursmentDetailsSheet.jsx";
import ReimbursmentDetailsRequest from "../Sections/ReimbursmentDetailsRequest.jsx";
import { connect, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { MyClaimsRequestColumns } from "app/utils/Types/TableColumns.jsx";
import { getReimbursement } from "app/hooks/payroll.jsx";
import PageLoader from "components/PageLoader.jsx";
import { getEmployeePayroll } from "app/hooks/payroll.jsx";
import { getEmployeeData } from "app/hooks/employee.jsx";



const ClaimRequest = ({userProfile}) => {
  const [filterData, setFilterData] = useState({});
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedClaimRequest, setSelectedClaimRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const [myClaims, setMyClaims] = useState(null);
  const [employeeData, setEmployeeData] = useState(null);
  const [claimRequests, setClaimRequests] = useState({});
  const pathname = location.pathname;

  const onPageChange = (name, value) => {
    setOptions((prevOptions) => ({ ...prevOptions, [name]: value }));
  };
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


  const fetchMyClaims = async () => {
     setLoading(true);
    const payroll = await getEmployeePayroll({
      filterData: { employee_id: userProfile.id },
    });
    
    const empData = await getEmployeeData(userProfile.id);
    if (empData) {
      setEmployeeData(empData);
    }
    const response = await getReimbursement({
      filterData: { employee_payroll: payroll?.results[0]?.id },
    });
    if (response) {
      console.log(response);
      setMyClaims(response);
    }
    setLoading(false);
  };

  const fetchClaimRequests = async () => {
    setLoading(true);
    const response = await getReimbursement({ filterData });
    if (response) {
      setClaimRequests(response);
    }
    setLoading(false);
  }

  useEffect(() => {
   
    
    if (isMyClaims) {
      fetchMyClaims();
    } else {
      fetchClaimRequests();
    }
    
  }, []);

  return (
    <div className="flex flex-col gap-4 salary-startup">
      {selectedClaimRequest && (
        <ReimbursmentDetailsSheet
          claimRequest={selectedClaimRequest}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          isMyClaims={isMyClaims}
          employeeData={employeeData}
          reload = {fetchClaimRequests}
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
                    {isMyClaims
                      ? "Your reimburment request status is displyed"
                      : " All employee reimbursements are displayed"}
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
          {loading ? (
            <PageLoader />
          ) : isMyClaims ? (
            <CustomTable
              data={myClaims?.results}
              columns={MyClaimsRequestColumns}
              pagination={true}
              dataTotalSize={myClaims?.count}
              tableOptions={tableOptions}
            />
          ) : (
            <CustomTable
              data={claimRequests?.results}
              columns={ClaimRequestColumns}
              pagination={true}
              dataTotalSize={claimRequests?.count}
              tableOptions={tableOptions}
              selectable={true}
              setSelectedRows={setSelectedRows}
              selectedRows={selectedRows}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    userProfile: state.user.userProfile,
  };
};

export default connect(mapStateToProps)(ClaimRequest);