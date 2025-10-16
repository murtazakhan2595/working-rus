
// File: TeamAttendanceReport.jsx
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "components/ui/card";
import { TableCustom, PageLoader } from "components";
import { getTeamAttendanceReportData } from "app/hooks/reports";
import { TeamAttendanceColumns } from "../../TableColumns/AdditionalReportsColumns";

const TeamAttendanceReport = ({
  filterData = {},
  permittedViewFilterData = {},
  onFilterChange = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const [teamData, setTeamData] = useState({
    results: [],
    count: 0,
    aggregated_stats: null,
  });
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("-present");

  const fetchTeamData = async () => {
    setLoading(true);
    try {
      const combinedFilters = { ...filterData, ...permittedViewFilterData };
      const payload = {
        filterData: combinedFilters,
        options,
        ordering,
      };

      const response = await getTeamAttendanceReportData(payload);
      if (response) {
        setTeamData(response);
      }
    } catch (error) {
      console.error("Error fetching team attendance data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (permittedViewFilterData !== null) {
      fetchTeamData();
    }
  }, [filterData, permittedViewFilterData, options, ordering]);

  const onPageChange = (name, value) => {
    setOptions((prevOptions) => ({ ...prevOptions, [name]: value }));
  };

  const tableOptions = {
    page: options.page,
    sizePerPage: options.sizePerPage,
    onPageChange: onPageChange,
    onSortChange: (sortName) => {
      setOrdering(sortName);
    },
  };

  return (
    <div className="space-y-6">
      {/* Team Attendance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Team Attendance Report</CardTitle>
          <CardDescription>
            Track attendance trends for specific teams and their members
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <PageLoader />
          ) : (
            <TableCustom
              columns={TeamAttendanceColumns()}
              data={teamData.results}
              pagination={true}
              dataTotalSize={teamData.count}
              tableOptions={tableOptions}
              fallbackText="No team attendance data found"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamAttendanceReport;