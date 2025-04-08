import React, { useEffect, useState } from "react";

import Header from "../../../../components/Header.jsx";
import { FilterInput } from "components/FormControl";
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
import { Button } from "components/ui/button";
import { deleteReimbursement } from "app/hooks/payroll.jsx";
import { toast } from "react-toastify";
import { DateInput } from "components/FormControl";



const ClaimRequest = ({userProfile}) => {
  const [filterData, setFilterData] = useState({});
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedExpenseType, setSelectedExpenseType] = useState("");
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedClaimRequest, setSelectedClaimRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const [myClaims, setMyClaims] = useState(null);
  const [employeeData, setEmployeeData] = useState(null);
  const [claimRequests, setClaimRequests] = useState({});
  const [filterDate, setFilterDate] = useState(null);
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
    if (filterName === "status") setSelectedStatus(filterValue);
    if (filterName === "expense_type") setSelectedExpenseType(filterValue);
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
      filterData: { employee_payroll: payroll?.results[0]?.id, ...filterData },
    }, options);
    if (response) {
      console.log(response);
      setMyClaims(response);
    }
    setLoading(false);
  };

  const fetchClaimRequests = async () => {
    setLoading(true);
    console.log("userProfile in fetchclaimrequests", userProfile);
    let filter = {}
    if(userProfile.role === 2){
      filter = { ...filterData, manager: userProfile.id };
    }
    else{
      filter = { ...filterData };
    }
    console.log("filter", filter);
    const response = await getReimbursement({
      filterData: filter,
    }, options);
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
  }, [filterData, options]);
  useEffect(() => {
    setFilterData({})
    setFilterDate(null)
  },[isMyClaims, options])
const handleDeleteClaims = async () => {
  if (selectedRows.length === 0) return; // Ensure there are selected rows

  setLoading(true); // Show loading while deleting claims

  try {
    // Find selected claims from claimRequests
    const selectedClaimRequests = claimRequests?.results?.filter((claim) =>
      selectedRows.includes(claim.id)
    );

    // Filter rejected claims (only those that can be deleted)
    const rejectedClaims = selectedClaimRequests?.filter(
      (claim) =>
        claim.status_superadmin?.status === "rejected" ||
        claim.status_hr?.status === "rejected" ||
        claim.status_manager?.status === "rejected"
    );

    // Filter out non-rejected claims (pending or approved)
    const nonRejectedClaims = selectedClaimRequests?.filter(
      (claim) =>
        claim.status_superadmin?.status !== "rejected" &&
        claim.status_hr?.status !== "rejected" &&
        claim.status_manager?.status !== "rejected"
    );

    // Show error if any non-rejected claims are selected
    if (nonRejectedClaims.length > 0) {
      toast.error("Only rejected claims can be deleted.");
      setLoading(false);
      return;
    }

    // Check if there are no rejected claims to delete
    if (rejectedClaims.length === 0) {
      toast.error("No rejected claims selected for deletion.");
      setLoading(false);
      return;
    }

    // Delete each rejected claim
    const deletionPromises = rejectedClaims.map(async (claim) => {
      const success = await deleteReimbursement(claim.id);
      return success;
    });

    // Wait for all deletions to complete
    const deletionResults = await Promise.all(deletionPromises);

    // Check for failed deletions
    const failedDeletions = deletionResults.filter(
      (result) => result === false
    );

    if (failedDeletions.length === 0) {
      toast.success("Rejected claims deleted successfully.");
    } else {
      toast.error(`${failedDeletions.length} claims failed to delete.`);
    }

    // Reload claim requests and reset selected rows after deletion
    fetchClaimRequests();
    setSelectedRows([]);
  } catch (error) {
    console.error("Error deleting claims:", error);
  } finally {
    setLoading(false); // Hide loading after completion
  }
};


  return (
    <div className="flex flex-col gap-4 salary-startup">
      {selectedClaimRequest && (
        <ReimbursmentDetailsSheet
          claimRequest={selectedClaimRequest}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          isMyClaims={isMyClaims}
          employeeData={employeeData}
          reload={fetchClaimRequests}
        />
      )}
      <Header
        content={
          isMyClaims ? (
            <ReimbursmentDetailsRequest reload={fetchMyClaims} />
          ) : null
        }
      />
     
          <div className="flex items-center justify-end ">
           
            <div className="flex items-center gap-3 ">
              {selectedRows.length > 0 && (
                <Button onClick={handleDeleteClaims}>Delete</Button>
              )}
              <FilterInput
                filters={[
                  {
                    type: "select-one",
                    option: [],
                    name: "expense_type",
                    placeholder: "Expense Type",
                    values: selectedExpenseType,
                    value: selectedExpenseType
                  },
                  {
                    type: "select-two",
                    option: [
                      { value: "pending", label: "Pending" },
                      { value: "approved", label: "Approved" },
                      { value: "rejected", label: "Rejected" },
                    ],
                    name: "status",
                    placeholder: "Status",
                    values: selectedStatus,
                    value: selectedStatus
                  },
                ]}
                onChange={handleFilterChange}
              />
              <DateInput
                placeholder="Date"
                value={filterDate}
                name="payment_date"
                onChange={(field, value) => {
                  setFilterDate(value);
                  handleFilterChange(field, value);
                }}
              />
            </div>
          </div>
        <Card>
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