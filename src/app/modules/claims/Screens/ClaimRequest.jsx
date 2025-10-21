import React, { useEffect, useState } from "react";
import Header from "../../../../components/Header.jsx";
import { FilterInput } from "components/FormControl";
import {
  Card,
  CardContent,
  CardHeader,
} from "../../../../components/ui/card.jsx";
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
import { claimExpenseChoices } from "app/hooks/payroll.jsx";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { HasAccess } from "utils/PermissionUtils";
import { UnauthorizedAccess } from "components";

const ClaimRequest = ({ userProfile }) => {
  // Permission checks for claims features
  const canRequestClaim = HasAccess("REQUEST_CLAIM");
  const canViewClaims = HasAccess("VIEW_CLAIMS");
  const canDeleteClaim = HasAccess("DELETE_CLAIM");
  const canExportClaims = HasAccess("EXPORT_CLAIM_REQUEST") || HasAccess("VIEW_CLAIMS"); // Fallback permission

  const [filterData, setFilterData] = useState({});
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedExpenseType, setSelectedExpenseType] = useState("");
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [selectedClaimRequest, setSelectedClaimRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const [myClaims, setMyClaims] = useState(null);
  const [employeeData, setEmployeeData] = useState(null);
  const [claimRequests, setClaimRequests] = useState({});
  const [filterDate, setFilterDate] = useState(null);
  const [expenseTypeOptions, setExpenseTypeOptions] = useState([]);

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
    if (!canViewClaims) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const payroll = await getEmployeePayroll({
      filterData: { employee_id: userProfile.id },
    });

    const empData = await getEmployeeData(userProfile.id);
    if (empData) {
      setEmployeeData(empData);
    }
    if (payroll?.count === 0) {
      setLoading(false);
      return toast.error("No payroll found for this employee.");
    }
    const response = await getReimbursement(
      {
        filterData: {
          employee_payroll: payroll?.results[0]?.id,
          ...filterData,
        },
      },
      options
    );
    if (response) {
      setMyClaims(response);
    }
    const expenseTypeOptions = await claimExpenseChoices();
    if (expenseTypeOptions) {
      setExpenseTypeOptions(
        expenseTypeOptions.results.map((op) => ({
          value: op.id,
          label: op.name,
        }))
      );
    }
    setLoading(false);
  };

  const fetchClaimRequests = async () => {
    if (!canViewClaims) {
      setLoading(false);
      return;
    }

    setLoading(true);
    let filter = {};
    if (userProfile.role === 2) {
      filter = { ...filterData, manager: userProfile.id };
    } else {
      filter = { ...filterData };
    }
    const response = await getReimbursement(
      {
        filterData: filter,
      },
      options
    );
    if (response) {
      setClaimRequests(response);
    }
    const expenseTypeOptions = await claimExpenseChoices();
    if (expenseTypeOptions) {
      setExpenseTypeOptions(
        expenseTypeOptions.results.map((op) => ({
          value: op.id,
          label: op.name,
        }))
      );
    }
    setLoading(false);
  };

  const exportToExcel = async () => {
    if (!canExportClaims) {
      toast.error("You don't have permission to export claims data.");
      return;
    }

    try {
      setLoading(true);
      // Get all data without pagination for export
      let filter = {};
      if (userProfile.role === 2) {
        filter = { ...filterData, manager: userProfile.id };
      } else {
        filter = { ...filterData };
      }

      // Request all data (no pagination)
      const response = await getReimbursement(
        {
          filterData: filter,
        },
        { page: 1, sizePerPage: 1000 }
      ); // Assuming we want to export all data, adjust limit if needed

      if (response && response.results && response.results.length > 0) {
        // Map expense type IDs to their names
        const formattedData = response.results.map((claim) => {
          // Find expense type name
          const expenseType = expenseTypeOptions.find(
            (option) => option.value === claim.expense_type
          );

          return {
            "Employee ID": claim.serial_number,
            "Employee Name": claim.full_name,
            Email: claim.work_email,
            Amount: claim.amount,
            Description: claim.description,
            Reason: claim.reason,
            Status: claim.status,
            "Expense Type": expenseType
              ? expenseType.label
              : claim.expense_type,
            "Submission Date": claim.submission_date,
            "Approval Date": claim.approval_date || "-",
            "Rejection Date": claim.rejection_date || "-",
            "Payment Date": claim.payment_date,
            Paid: claim.is_paid ? "Yes" : "No",
            "Manager Approval": claim.status_manager?.status || "pending",
            "HR Approval": claim.status_hr?.status || "pending",
            "Admin Approval": claim.status_superadmin?.status || "pending",
          };
        });

        // Create workbook and worksheet
        const worksheet = XLSX.utils.json_to_sheet(formattedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(
          workbook,
          worksheet,
          "Reimbursement Claims"
        );

        // Generate Excel file
        const excelBuffer = XLSX.write(workbook, {
          bookType: "xlsx",
          type: "array",
        });
        const data = new Blob([excelBuffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        // Save the file
        saveAs(
          data,
          `reimbursement-claims-${new Date().toISOString().split("T")[0]}.xlsx`
        );
        toast.success("Export successful!");
      } else {
        toast.error("No data available to export");
      }
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isMyClaims) {
      fetchMyClaims();
    } else {
      fetchClaimRequests();
    }
  }, [filterData, options]);

  useEffect(() => {
    setFilterData({});
    setFilterDate(null);
  }, [isMyClaims]);

  // If user has no claims permissions at all
  if (!canViewClaims && !canRequestClaim) {
    return (
      <UnauthorizedAccess
        title="Claims Access Denied"
        featureName="claims management"
        message="You don't have permission to view or manage claims. Please contact your administrator to request access."
        showButtons={true}
        size="lg"
      />
    );
  }

  return (
    <div className="flex flex-col gap-4 salary-startup">
      {isOpen && (
        <ReimbursmentDetailsSheet
          claimRequest={selectedClaimRequest}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          isMyClaims={isMyClaims}
          employeeData={employeeData}
          reload={fetchClaimRequests}
          expenseTypeOptions={expenseTypeOptions}
        />
      )}

      <Header
        content={
          isMyClaims ? (
            canRequestClaim ? (
              <ReimbursmentDetailsRequest reload={fetchMyClaims} />
            ) : (
              <div className="p-2 text-sm text-red-700 border border-red-200 rounded bg-red-50">
                You don't have permission to request claims
              </div>
            )
          ) : (
            canExportClaims ? (
              <Button
                onClick={exportToExcel}
                disabled={loading}
              >
                Export to Excel
              </Button>
            ) : (
              <div className="p-2 text-sm text-red-700 border border-red-200 rounded bg-red-50">
                You don't have permission to export claims
              </div>
            )
          )
        }
      />

      <div className="flex items-center justify-end ">
        <div className="flex items-center gap-3 ">
          {canViewClaims && (
            <>
              <FilterInput
                filters={[
                  {
                    type: "select",
                    options: expenseTypeOptions,
                    name: "expense_type",
                    placeholder: "Expense Type",
                    values: selectedExpenseType,
                    value: selectedExpenseType,
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
                    value: selectedStatus,
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
                className="w-fit"
              />
            </>
          )}
        </div>
      </div>

      <Card>
        <CardContent>
          {loading ? (
            <PageLoader />
          ) : !canViewClaims ? (
            <UnauthorizedAccess
              title="Claims View Access Denied"
              featureName="claims data"
              message="You don't have permission to view claims information. Please contact your administrator to request access."
              size="md"
            />
          ) : isMyClaims ? (
            <CustomTable
              data={myClaims?.results}
              columns={MyClaimsRequestColumns(expenseTypeOptions)}
              pagination={true}
              dataTotalSize={myClaims?.count}
              tableOptions={tableOptions}
            />
          ) : (
            <CustomTable
              data={claimRequests?.results}
              columns={ClaimRequestColumns(expenseTypeOptions)}
              pagination={true}
              dataTotalSize={claimRequests?.count}
              tableOptions={tableOptions}
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
