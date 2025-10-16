import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "components/ui/card";
import { TableCustom, PageLoader } from "components";
import { Badge } from "components/ui/badge";
import { AlertTriangle } from "lucide-react";
import { getEmployeeReportsData } from "app/hooks/reports";
import { SkillsQualificationsColumns } from "../TableColumns/ReportTableColumns";

const SkillQualificationReport = ({
  filterData = {},
  permittedViewFilterData = {},
  onFilterChange = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const [employeeData, setEmployeeData] = useState({ results: [], count: 0 });
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("name");

  const fetchSkillsData = async () => {
    setLoading(true);
    try {
      const combinedFilters = { ...filterData, ...permittedViewFilterData };
      const payload = { filterData: combinedFilters, options, ordering };
      const response = await getEmployeeReportsData(payload);
      if (response) setEmployeeData(response);
    } catch (error) {
      console.error("Error fetching skills data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (permittedViewFilterData !== null) {
      fetchSkillsData();
    }
  }, [filterData, permittedViewFilterData, options, ordering]);

  const onPageChange = (name, value) => {
    setOptions((prevOptions) => ({ ...prevOptions, [name]: value }));
  };

  const tableOptions = {
    page: options.page,
    sizePerPage: options.sizePerPage,
    onPageChange: onPageChange,
    onSortChange: (sortName) => setOrdering(sortName),
  };

  return (
    <div className="space-y-6">


      {/* Skills & Qualifications Table */}
      <Card>
        <CardHeader>
          <CardTitle>Skills & Qualifications Report</CardTitle>
          <CardDescription>
            Employee education, certifications, and skills matrix for competency
            tracking and development planning.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <PageLoader />
          ) : (
            <TableCustom
              columns={SkillsQualificationsColumns()}
              data={employeeData.results}
              pagination={true}
              dataTotalSize={employeeData.count}
              tableOptions={tableOptions}
              fallbackText="No skills/qualifications data found"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SkillQualificationReport;
