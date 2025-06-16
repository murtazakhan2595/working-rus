import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "src/@/components/ui/tabs";
import { FilterInput } from "components/FormControl";
import { getAttendanceAdjustmentListData } from "app/hooks/attendance";
import { AttendanceAdjustmentsColumns } from "app/modules/Attendance/Sections/AttendanceTableColumns";
import { CardDescription, CardTitle, CardContent } from "components/ui/card";
import { PageLoader, TableCustom } from "components";
import { GetEmployeeFilteredList, GetCommonFilteredList } from "utils/Lists";
import { GlobalStatusOptions } from "data/Data";

const innerTabClassName =
  "shadow-none border-transparent mr-4 border-b data-[state=active]:border-plum-1100 w-28 data-[state=active]:text-primary-1100 rounded-none data-[state-active]:font-medium";
const AttendanceAdjustmentRecord = ({
  isTeamView = false,
  isDepartmentView = false,
  isBranchView = false,
  adminView = false,
}) => {
  const Employees = GetEmployeeFilteredList(
    isTeamView,
    adminView,
    isBranchView,
    isDepartmentView
  );
  const Department = GetCommonFilteredList("departments");
  const Branches = GetCommonFilteredList("branches");
  const [activeInnerTab, setActiveInnerTab] = useState("Requests");
  const [TimeAdjustmentList, setTimeAdjustmentList] = useState({
    results: [],
    count: 0,
  });
  const [isloading, setIsLoading] = useState(false);
  const [filterData, setFilterData] = useState({ statuses: "PENDING" });
  const [ordering, setOrdering] = useState("-id");
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");

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

  const fetchData = async (isMounted) => {
    try {
      setIsLoading(true);

      const response = await getAttendanceAdjustmentListData({
        filterData,
        options,
        ordering,
      });

      if (isMounted && response) {
        setTimeAdjustmentList(response);
      }
    } catch (error) {
      console.error("Error fetching Approval Hierarchy:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    fetchData(isMounted);
    return () => {
      isMounted = false;
    };
  }, [filterData, ordering, options]);

  const handleFilterChange = (filterName, filterValue) => {
    onPageChange("page", 1);
    if (filterName === "employee") setSelectedEmployee(filterValue);
    if (filterName === "statuses") setSelectedStatus(filterValue);
    if (filterName === "branch_id") setSelectedBranch(filterValue);
    if (filterName === "department_name") setSelectedDepartment(filterValue);
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

  const handleTabChange = (tab) => {
    if (tab === "Requests") {
      setFilterData({ statuses: "PENDING" });
    } else if (tab === "Records") {
      setFilterData({ statuses: "APPROVED,REJECTED" });
    }
  };

  return (
    <Tabs
      className="w-full"
      onValueChange={(tab) => {
        handleTabChange(tab);
        setActiveInnerTab(tab);
      }}
      value={activeInnerTab}
    >
      <div className="flex flex-col items-start justify-between lg:flex-row md:flex-row xl:flex-row">
        <TabsList className="flex items-center justify-center mb-4">
          {["Requests", "Records"].map((tab) => (
            <TabsTrigger key={tab} value={tab} variant='inner-tab'>
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      <div>
        <div className="flex flex-col gap-4 px-6">
          <CardTitle className="text-primary pt-6">
            Attandance Adjustments {activeInnerTab}
          </CardTitle>
          <CardDescription className="text-neutral-1100">
            Here you can manage time adjustments. View, reject, or approve as
            needed.
          </CardDescription>
          <FilterInput
            filters={[
              {
                type: "select-one",
                placeholder: "Employee",
                name: "employee",
                option: Employees,
                values: selectedEmployee,
              },
              ...(adminView || isBranchView
                ? [
                    {
                      type: "select-two",
                      placeholder: "Department",
                      name: "department_name",
                      option: Department,
                      values: selectedDepartment,
                    },
                  ]
                : []),
              ...(adminView || isDepartmentView
                ? [
                    {
                      type: "select-three",
                      placeholder: "Branch",
                      name: "branch_id",
                      option: Branches,
                      values: selectedBranch,
                    },
                  ]
                : []),
              ...(activeInnerTab === "Records"
                ? [
                    {
                      type: "select-four",
                      placeholder: "Status",
                      name: "statuses",
                      option: GlobalStatusOptions(false),
                      values: selectedStatus,
                    },
                  ]
                : []),
            ]}
            onChange={handleFilterChange}
            className="justify-end"
          />
          <CardContent className="px-0">
            {isloading ? (
              <PageLoader />
            ) : (
              <TableCustom
                columns={AttendanceAdjustmentsColumns(
                  activeInnerTab === "Records",
                  fetchData
                )}
                data={TimeAdjustmentList.results || []}
                pagination={true}
                dataTotalSize={TimeAdjustmentList?.count || 0}
                className="TimeAdjustmentList-table"
                tableOptions={tableOptions}
              />
            )}
          </CardContent>
        </div>
      </div>
    </Tabs>
  );
};

export default AttendanceAdjustmentRecord;
