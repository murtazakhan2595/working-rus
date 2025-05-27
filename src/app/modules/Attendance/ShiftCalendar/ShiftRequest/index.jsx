
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "components/ui/card";
import { TableCustom } from "components";
import { useSelector } from "react-redux";
import {
  getShiftSchedule,
  updateShiftSchedule,
} from "app/hooks/shiftManagement";
import { employeeData } from "app/hooks/attendance";
import { getChangeRequestComparison } from "../ShiftCalendarTab/shiftScheduleUtils";
import { toast } from "react-toastify";
import moment from "moment";
import { FilterInput } from "components/FormControl";
import { EmployeeOverview } from "components";
import { getRoleList } from "app/hooks/general";
import { BranchName } from "utils/getValuesFromTables";
import { EmployeeColumns } from "../ShiftCalendarTab/shiftChangeRequestColumns";
const ShiftRequest = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [ordering, setOrdering] = useState("-id");
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [roles, setRoles] = useState([]);
  const [shiftRequests, setShiftRequests] = useState({
    results: [],
    count: 0,
  });
  const [filters, setFilters] = useState({
    status: "",
    requestor_role: "",
  });
  const onPageChange = (name, value) => {
    setOptions((prevOptions) => ({ ...prevOptions, [name]: value }));
  };
  const employees = useSelector((state) => state.emp.employees);

  const tableOptions = {
    page: options.page,
    sizePerPage: options.sizePerPage,
    onPageChange: onPageChange,
    onSortChange: (sortName) => {
      setOrdering(sortName);
    },
  };
  const fetchRoles = async (isMounted) => {
    const response = await getRoleList();
    if (isMounted && response) {
      setRoles(response.results || []);
    }
  }

  useEffect(() => {
    let isMounted = true;
    fetchRoles(isMounted);
    return () => {
      isMounted = false; 
    };
  }, []);
  // Fetch shift change requests
  useEffect(() => {
    fetchShiftRequests();
  }, [ordering, options.page, options.sizePerPage, filters]);

  const fetchShiftRequests = async () => {
    setIsLoading(true);
    try {
      const filterData = {
        is_change_request: true,
        page: options.page,
        page_size: options.sizePerPage,
        shift_requested: "Employee",
      };

      const response = await getShiftSchedule({
        filterData,
        ordering: ordering,
      });

      if (response && response.results) {
        // Enhance results with additional data
        const enhancedResults = await Promise.all(
          response.results.map(async (request) => {
            const comparisonData = await getChangeRequestComparison(request);
            const employeeData = employees.find(
              (emp) => emp.id === request.employee
            );
            return {
              ...request,
              employee: employeeData,
              comparison_data: comparisonData,
            };
          })
        );

        setShiftRequests({
          ...response,
          results: enhancedResults,
        });
      }
    } catch (error) {
      console.error("Error fetching shift requests:", error);
      toast.error("Failed to load shift change requests");
    } finally {
      setIsLoading(false);
    }
  };

  console.log("Shift Requests:", shiftRequests);

  // const handleViewDetails = (request) => {
  //   setSelectedRequest(request);
  //   setIsDetailsModalOpen(true);
  // };

  const handleApprove = async (requestId) => {
    // try {
    //   const response = await updateShiftSchedule(requestId, {
    //     status: "Approved",
    //     approved_by: userProfile?.id,
    //     approval_date: moment().format("YYYY-MM-DD"),
    //   });

    //   if (response) {
    //     toast.success("Shift change request approved successfully");
    //     fetchShiftRequests();
    //     setIsDetailsModalOpen(false);
    //   }
    // } catch (error) {
    //   console.error("Error approving request:", error);
    //   toast.error("Failed to approve request");
    // }
  };

  const handleReject = async (requestId, rejectionReason) => {
    // if (!rejectionReason) {
    //   toast.error("Rejection reason is required");
    //   return;
    // }

    // try {
    //   const response = await updateShiftSchedule(requestId, {
    //     status: "Rejected",
    //     rejection_reason: rejectionReason,
    //     approved_by: userProfile?.id,
    //     approval_date: moment().format("YYYY-MM-DD"),
    //   });

    //   if (response) {
    //     toast.success("Shift change request rejected");
    //     fetchShiftRequests();
    //     setIsDetailsModalOpen(false);
    //   }
    // } catch (error) {
    //   console.error("Error rejecting request:", error);
    //   toast.error("Failed to reject request");
    // }
  };

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setOptions((prev) => ({ ...prev, page: 1 })); // Reset to first page
  };

  return (
    <div
      className={`flex flex-col gap-4 ${window.location.pathname.substring(1)}`}
    >
      <div className="flex flex-col justify-between gap-2 lg:flex-row md:flex-row xl:flex-row">
        <FilterInput
          filters={[
            {
              type: "select",
              option: [],
              name: "status",
              placeholder: "Filter by Status",
              values: filters.status,
            },
            {
              type: "select",
              option: [],
              name: "requestor_role",
              placeholder: "Filter by Requestor",
              values: filters.requestor_role,
            },
          ]}
          onChange={handleFilterChange}
        />
      </div>

      <Card>
        <CardContent>
          <TableCustom
            data={shiftRequests.results}
            columns={EmployeeColumns}
            pagination={true}
            dataTotalSize={shiftRequests.count}
            tableOptions={tableOptions}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>

      {/* Details Modal */}
      {/* {isDetailsModalOpen && selectedRequest && (
        <ShiftRequestDetailsModal
          isOpen={isDetailsModalOpen}
          setIsOpen={setIsDetailsModalOpen}
          request={selectedRequest}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )} */}
    </div>
  );
};

export default ShiftRequest;
