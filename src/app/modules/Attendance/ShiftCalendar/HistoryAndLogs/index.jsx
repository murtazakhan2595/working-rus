import { getEmployeeCustomList } from "app/hooks/general";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Card, CardContent } from "components/ui/card";
import { TableCustom } from "components";
import { HistoryColumns } from "./HistoryColumns";
import { useNavigate } from "react-router-dom";
import { FilterInput } from "components/FormControl";
import { PageLoader } from "components";


export default function HistoryAndLogs() {
  const [employees, setEmployees] = useState({ results: [], count: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("-id");
  const [filterData, setFilterData] = useState({});
  const navigate = useNavigate();
const Departments = useSelector((state) => state.common.departments);
const Branches = useSelector((state) => state.common.branches);
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
  const fetchEmployees = async () => {
    try {
      setIsLoading(true);
        const response = await getEmployeeCustomList(
          {options,
          filterData,
          ordering}
        );
        if (response) {
          setEmployees(response);
        }
        setIsLoading(false);
      } catch (err) {
        console.error(err);
      }
    setIsLoading(false);
    };
  useEffect(()=>{
    fetchEmployees();
  },[filterData, options, ordering]);

  const handleFilterChange = (filterName, filterValue) => {
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
  return (
    <div
      className={`flex flex-col gap-4 ${window.location.pathname.substring(1)}`}
    >
      <div className="flex justify-end">
        <FilterInput
          filters={[
            {
              type: "search",
              placeholder: "Search by ID and Name",
              name: "emp_search",
            },
            {
              type: "select-one",
              option: Departments,
              name: "department_name",
              placeholder: "Department",
              values: filterData.department_name || "",
            },
            {
              type: "select-two",
              option: Branches,
              name: "branch_id",
              placeholder: "Branch",
              values: filterData.branch_id || "",
            },
          ]}
          onChange={handleFilterChange}
        />
      </div>
      <Card>
        <CardContent>
          {isLoading ? (
            <PageLoader />
          ) : (
            <TableCustom
              data={employees.results}
              columns={HistoryColumns(navigate)}
              pagination={true}
              dataTotalSize={employees.count || 0}
              tableOptions={tableOptions}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}