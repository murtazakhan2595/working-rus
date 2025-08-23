// src/app/modules/OfficeSetting/Screens/ClearanceChecklist/index.jsx
import React, { useEffect, useState } from "react";
import TableCustom from "components/CustomTable";
import { Card } from "components/ui/card";
import { CardContent } from "components/ui/card";
import PageLoader from "../../../../../components/PageLoader";
import { ClearanceChecklistColumn } from "app/modules/OfficeSetting/sections/OfficeSettingTableColumns";
import { FilterInput } from "components/FormControl";
import { CardHeader } from "components/ui/card";
import { CardTitle } from "components/ui/card";
import { CardDescription } from "components/ui/card";
import { useSelector } from "react-redux";
import {
  getClearanceChecklistList,
  getClearanceTypeList,
} from "app/hooks/officeSetting";
import { assignmentScopeOptions } from "data/Data";

const ClearanceChecklist = ({ reload }) => {
  const Departments = useSelector((state) => state.common.departments);
  const [ClearanceChecklistList, setClearanceChecklistList] = useState({});
  const [filterData, setFilterData] = useState({});
  const [ordering, setOrdering] = useState("-id");
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedClearanceType, setSelectedClearanceType] = useState("");
  const [selectedAssignmentScope, setSelectedAssignmentScope] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [clearanceTypeOptions,setClearanceTypeOptions] = useState([]);

  // Status options
  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ];

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
    setIsLoading(true);
    try {
      const filters = { ...filterData };
      if(filters?.department){
        filters.department = [filters.department];
      }
      const response = await getClearanceChecklistList({
        filterData: filters,
        options,
        ordering,
      });

      if (isMounted && response) {
        setClearanceChecklistList(response);
      }
    } catch (error) {
      console.error(error);
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

  useEffect(() => {
    let isMounted = true;
    onPageChange("page", 1);
    setOrdering("-id");
    fetchData(isMounted);
    return () => {
      isMounted = false;
    };
  }, [reload]);

  useEffect(()=>{
    let isMounted = true;
    const fetchClearanceTypes = async () => {
      try {
        const response = await getClearanceTypeList();
        if (isMounted && response) {
          console.log(response)
          setClearanceTypeOptions(response.results.map((item) => ({
            value: item.id,
            label: item.name,
          })));
        }
      } catch (error) {
        console.error("Error fetching clearance types:", error);
      }
    };
    fetchClearanceTypes();
    return () => {
      isMounted = false;
    };
  },[])

  const handleFilterChange = (filterName, filterValue) => {
    onPageChange("page", 1);

    if (filterName === "department") setSelectedDepartment(filterValue);
    if (filterName === "clearance_type") setSelectedClearanceType(filterValue);
    if (filterName === "assignment_scope")
      setSelectedAssignmentScope(filterValue);
    if (filterName === "status") setSelectedStatus(filterValue);

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

  console.log("INFO", ClearanceChecklistList)

  return (
    <div className="flex flex-col justify-end gap-4 w-full">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-primary">Clearance Checklist</CardTitle>
          <CardDescription className="text-neutral-1100">
            Manage job clearance checklist items based on department and
            clearance types. Create, edit, or delete checklist items as needed.
          </CardDescription>
          <div className="flex justify-end">
            <FilterInput
              filters={[
                {
                  type: "search",
                  placeholder: "Search by checklist name",
                  name: "name",
                },
                {
                  type: "select-one",
                  placeholder: "Department",
                  name: "department",
                  option: Departments,
                  values: selectedDepartment,
                },
                {
                  type: "select-two",
                  placeholder: "Clearance Type",
                  name: "clearance_types",
                  option: clearanceTypeOptions,
                  values: selectedClearanceType,
                },
                {
                  type: "select-three",
                  placeholder: "Assignment Scope",
                  name: "assignment_scope",
                  option: assignmentScopeOptions,
                  values: selectedAssignmentScope,
                },
                {
                  type: "select-four",
                  placeholder: "Status",
                  name: "status",
                  option: statusOptions,
                  values: selectedStatus,
                },
              ]}
              className="justify-end"
              onChange={handleFilterChange}
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <PageLoader />
          ) : (
            <TableCustom
              columns={ClearanceChecklistColumn(
                fetchData,
                Departments,
                clearanceTypeOptions
              )}
              data={ClearanceChecklistList?.results || []}
              tableOptions={tableOptions}
              dataTotalSize={ClearanceChecklistList?.count || 0}
              pagination={true}
              className="clearance-checklist-table"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ClearanceChecklist;
