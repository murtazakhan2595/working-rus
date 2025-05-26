import {
  getApprovalHierarchyList,
  getDelegationList,
  getApprovalHierarchyData,
} from "app/hooks/approvalHierarchy";
import {
  ApprovalHierarchy,
  ApprovalLevel,
} from "app/utils/Types/ApprovalHierarchy";
import { TextInput, SelectInputComponent } from "components/FormControl";
import { validateApprovalHierarchyFormSchema } from "app/utils/FormSchema/ApprovalHierarchyFormSchema";
import {
  HierarchyLevelsColumn,
  DelegateLevelsColumn,
} from "app/modules/ApprovalHierarchy/Sections";
import { AddEditApprovalHierarchyLevels } from "app/modules/ApprovalHierarchy";
import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { Header, SheetUI, TableCustom } from "components";
import { Card } from "components/ui/card";
import { CardContent } from "components/ui/card";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { ApprovalHierarchyRequestType } from "data/Data";
import { Button } from "components/ui/button";
import { FilterInput } from "components/FormControl";
import { DetailBox } from "components/SheetCardExtension";
import { DesignationName } from "utils/getValuesFromTables";
import { SwitchInput } from "components/FormControl";
import { CardDescription, CardTitle } from "components/ui/card";
import { ApprovalHierarchyRequestTypeName } from "utils/getValuesFromTables";
import { StatusLabel } from "components";

const LevelDelegations = ({ heirarchy_id , viewMode=false}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [Delegations, setDelegations] = useState({});
  const Departments = useSelector((state) => state.common.departments);
  const Branches = useSelector((state) => state.common.branches);
  const [filterData, setFilterData] = useState({
    delegation_hierarchy: heirarchy_id,
  });
  const [ordering, setOrdering] = useState("-id");
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");

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
      const delegation = await getDelegationList({
        filterData,
        ordering,
        options,
      });
      if (isMounted) {
        setDelegations(delegation);
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
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
    if (filterName === "branch") setSelectedBranch(filterValue);
    if (filterName === "department") setSelectedDepartment(filterValue);
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
    <Card>
      <CardTitle className="text-primary px-6 pt-6 pb-2">Delegations</CardTitle>
      <CardContent className="flex flex-col gap-4 mt-6">
        <FilterInput
          filters={[
            {
              type: "select-one",
              placeholder: "Branch",
              name: "branch",
              option: Branches,
              values: selectedBranch,
            },
            {
              type: "select-two",
              placeholder: "Department",
              name: "department",
              option: Departments,
              values: selectedDepartment,
            },
          ]}
          className="justify-end"
          onChange={handleFilterChange}
        />
        <TableCustom
          columns={DelegateLevelsColumn(fetchData, viewMode)}
          data={Delegations.results || []}
          dataTotalSize={Delegations?.count || 0}
          pagination={true}
          tableOptions={tableOptions}
          className="ApprovalHierarchiesLevels-table"
        />
      </CardContent>
    </Card>
  );
};

export default LevelDelegations;
