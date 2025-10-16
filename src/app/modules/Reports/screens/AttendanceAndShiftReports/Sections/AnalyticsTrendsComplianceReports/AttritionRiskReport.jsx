
// File: AttritionRiskReport.jsx
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "components/ui/card";
import { TableCustom, PageLoader } from "components";
import { getAttritionRiskReportData } from "app/hooks/reports";
import { AttritionRiskColumns } from "../../TableColumns/AdditionalReportsColumns";

const AttritionRiskReport = ({
  filterData = {},
  permittedViewFilterData = {},
  onFilterChange = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const [attritionData, setAttritionData] = useState({
    results: [],
    count: 0,
    aggregated_stats: null,
  });
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("-absent_days");

  const fetchAttritionData = async () => {
    setLoading(true);
    try {
      const combinedFilters = { ...filterData, ...permittedViewFilterData };
      const payload = {
        filterData: combinedFilters,
        options,
        ordering,
      };

      const response = await getAttritionRiskReportData(payload);
      if (response) {
        setAttritionData(response);
      }
    } catch (error) {
      console.error("Error fetching attrition risk data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (permittedViewFilterData !== null) {
      fetchAttritionData();
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
      {/* Attrition Risk Table */}
      <Card>
        <CardHeader>
          <CardTitle>Attrition Risk Report</CardTitle>
          <CardDescription>
            Identify employees with high absenteeism patterns that may indicate resignation risk for proactive retention
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <PageLoader />
          ) : attritionData.results.length > 0 ? (
            <TableCustom
              columns={AttritionRiskColumns()}
              data={attritionData.results}
              pagination={true}
              dataTotalSize={attritionData.count}
              tableOptions={tableOptions}
              fallbackText="No attrition risk data found"
            />
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No employees identified as attrition risk</p>
              <p className="text-sm mt-2">
                This indicates good employee engagement and attendance compliance
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AttritionRiskReport;