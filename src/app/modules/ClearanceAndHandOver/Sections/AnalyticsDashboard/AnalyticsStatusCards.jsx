
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "components/ui/card";
import { DialogBox } from "components";
import { EmployeeOverview } from "components";
import { TextInput } from "components/FormControl";
import {
  buildStatusCounts,
  enhanceClearanceData,
} from "./clearanceAnalyticsUtils";
import { getClearanceAnalytics } from "app/hooks/clearanceAndHandover";
import { Badge } from "components/ui/badge";
import { renderDate } from "utils/renderValues";

const AnalyticsStatusCards = ({ apiData, loading = false, onCardClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalDetails, setModalDetails] = useState({});
  const [clearanceDetails, setClearanceDetails] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalLoading, setModalLoading] = useState(false);

  const statusCounts = buildStatusCounts(apiData);

  const handleCardClicked = async (event, { title, key, description }) => {
    event.preventDefault();
    event.stopPropagation();

    setModalLoading(true);
    try {
      // Prepare filter based on card type
      let filterData = {};

      switch (key) {
        case "pending":
          filterData.status = ["PENDING"];
          break;
        case "in_process":
          filterData.status = ["IN_PROCESS"];
          break;
        case "completed":
          filterData.status = ["COMPLETED"];
          break;
        case "rejected":
          filterData.status = ["REJECTED"];
          break;
        case "overdue":
          // For overdue, we'll filter client-side after getting all data
          break;
        case "total":
        default:
          // Show all data
          break;
      }

      const response = await getClearanceAnalytics(filterData);

      if (response && response.clearance_list) {
        let detailData = response.clearance_list;

        // If this is overdue card, filter for overdue items
        if (key === "overdue") {
          const enhanced = enhanceClearanceData(detailData);
          detailData = enhanced.filter((item) => item.is_overdue);
        }

        setClearanceDetails(detailData);
        setModalDetails({ Title: title, description: description });
        setIsOpen(true);
      }
    } catch (error) {
      console.error("Error fetching clearance details:", error);
    } finally {
      setModalLoading(false);
    }
  };

  const statsData = [
    {
      key: "total",
      title: "Total Requests",
      value: statusCounts?.total || 0,
      status: "",
      description: "Here is the list of all clearance requests",
    },
    {
      key: "pending",
      title: "Pending",
      value: statusCounts?.pending || 0,
      status: "pending",
      description: "Here is the list of all pending clearance requests",
    },
    {
      key: "in_process",
      title: "In Process",
      value: statusCounts?.in_process || 0,
      status: "in_process",
      description: "Here is the list of all requests currently being processed",
    },
    {
      key: "overdue",
      title: "Overdue",
      value: statusCounts?.overdue || 0,
      status: "overdue",
      description: "Here is the list of all overdue clearance requests",
    },
    {
      key: "completed",
      title: "Completed",
      value: statusCounts?.completed || 0,
      status: "completed",
      description: "Here is the list of all completed clearance requests",
    },
    {
      key: "rejected",
      title: "Rejected",
      value: statusCounts?.rejected || 0,
      status: "rejected",
      description: "Here is the list of all rejected clearance requests",
    },
  ];

  // Filter clearance requests based on search
  const FilteredClearanceRequests = React.useMemo(() => {
    if (
      !clearanceDetails ||
      (Array.isArray(clearanceDetails) && clearanceDetails.length === 0)
    )
      return [];

    const query = searchQuery.toLowerCase();
    return clearanceDetails.filter((item) => {
      const employeeName =
        `${item.employee__first_name} ${item.employee__last_name}`.toLowerCase();
      const matchesQuery = employeeName.includes(query);
      return matchesQuery;
    });
  }, [clearanceDetails, searchQuery]);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        {statsData.map((stat, index) => (
          <Card
            key={index}
            className="flex flex-col justify-center shadow-md border rounded-lg cursor-pointer"
            onClick={(event) => handleCardClicked(event, stat)}
          >
            {loading ? (
              <div className="animate-pulse">
                <CardHeader className="pb-2">
                  <CardTitle className="h-4 bg-gray-300 rounded w-2/3"></CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-8 bg-gray-300 rounded w-1/2"></div>
                </CardContent>
              </div>
            ) : (
              <>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-bold text-neutral-900">
                    {stat.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-medium text-plum-900">
                    {stat.value}
                  </p>
                </CardContent>
              </>
            )}
          </Card>
        ))}
      </div>

      <DialogBox
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title={modalDetails.Title}
        description={modalDetails.description}
        className=""
      >
        <div className="mt-2 mb-4">
          <div className="w-50 mb-5">
            <TextInput
              name="search_clearance"
              placeholder="Search by employee name"
              onChange={(_, value) => {
                setSearchQuery(value);
              }}
              value={searchQuery}
            />
          </div>

          {modalLoading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-plum-900"></div>
            </div>
          ) : (
            <>
              {(!FilteredClearanceRequests ||
                FilteredClearanceRequests.length === 0) && (
                <div className="flex justify-center text-neutral-900 font-[inter] text-sm">
                  {modalDetails.Title} clearance requests count is 0
                </div>
              )}

              {FilteredClearanceRequests.map((request) => (
                <div
                  key={`clearance-${request.id}`}
                  className="py-2 my-2 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <EmployeeOverview
                        id={request.employee}
                        showId={true}
                        showDepartment={true}
                        showBranchName={true}
                      />
                    </div>
                    <div className="ml-4 text-right">
                      <div className="flex flex-col gap-1 items-end">
                        <Badge
                          variant={
                            request.status === "COMPLETED"
                              ? "success"
                              : request.status === "IN_PROCESS"
                              ? "info"
                              : request.status === "REJECTED"
                              ? "error"
                              : "warning"
                          }
                        >
                          {request.status}
                        </Badge>
                        <div className="text-xs text-gray-500">
                          {request.clearance_type__name}
                        </div>
                        <div className="text-xs text-gray-500">
                          Started: {renderDate(request.start_date)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </DialogBox>
    </>
  );
};

export default AnalyticsStatusCards;
