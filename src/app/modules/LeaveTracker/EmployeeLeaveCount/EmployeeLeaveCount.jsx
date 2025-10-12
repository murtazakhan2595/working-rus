import React, { useEffect, useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
  CardHeader,
} from "components/ui/card";
import { FilterInput } from "components/FormControl";
import { Header, PageLoader, TableCustom } from "components";
import { getLeaveTypeListData, getLeaveListData } from "app/hooks/leaveTracker";
import { getEmployeeCustomList } from "app/hooks/general";
import { getLabelByValue } from "utils/getValuesFromTables";
import { LeaveRecordColumns } from "app/modules/LeaveTracker/Sections";
import { AddSpecialLeave } from "./index";
import { Button } from "components/ui/button";
import { HasAccess } from "utils/PermissionUtils";
import { GetDispatchStateList } from "utils/Lists";

const EmployeeLeaveCount = ({ isTeamView = false }) => {
  const Departments = GetDispatchStateList("departments", "common") || [];
  const Branches = GetDispatchStateList("branches", "common") || [];
  const Employees = GetDispatchStateList("employees", "emp") || [];
  const { id: user_id } = GetDispatchStateList("user_details", "emp") || {};
  const [filterData, setFilterData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [openAddSpecialLeaveForm, setOpenSpecialLeaveForm] = useState(false);
  const [Leaves, setLeaves] = useState({});
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("-id");

  const onPageChange = (name, value) => {
    setOptions((prevOptions) => ({ ...prevOptions, [name]: value }));
  };
  const tableOptions = {
    page: options.page,
    sizePerPage: options.sizePerPage,
    onPageChange: onPageChange,
  };

  useEffect(() => {
    let isMounted = true;
    setFilterData(() => {
      if (isTeamView) return { managers: user_id };
      else return {};
    });
    return () => {
      isMounted = false;
    };
  }, [isTeamView]);

  const fetchData = async (isMounted) => {
    try {
      setIsLoading(true);
      const Leaves = await getEmployeeCustomList({
        filterData: { ...filterData, employee_status: "Active,Probation,Notice Period", },
        options,
        ordering
      });
      if (Leaves && isMounted) {
        setLeaves(Leaves);
      }
    } catch (error) {
      console.log(error);
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
  }, [filterData, options, ordering]);

  const handleFilterChange = (filterName, filterValue) => {
    onPageChange("page", 1);
    setFilterData((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      if (filterValue === "" || filterValue === null) {
        delete updatedFilters[filterName];
      } else {
        updatedFilters[filterName] = filterValue;
      }

      return updatedFilters;
    });
  };
  const handleClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setOpenSpecialLeaveForm(true)
  }
  return (
    <div
      className={`flex flex-col gap-4 ${window.location.pathname.substring(1)}`}
    >
      <Header content={<Button onClick={handleClick}>Add Special Leave</Button>} />
      <Card>
        <CardHeader className="flex flex-row justify-between items-center gap-4">
          <div>
            <CardTitle className="text-primary">Leave Count</CardTitle>
            <CardDescription className="text-neutral-1100">
              {`Here you can view leaves alloted to all employees.`}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <FilterInput
            filters={[
              {
                type: "search",
                placeholder: "Search by ID and Name",
                name: "emp_search",
              },
              {
                type: "select",
                options: Departments,
                name: "department_name",
                placeholder: "Department",
              },
              {
                type: "select",
                options: Branches,
                name: "branch_id",
                placeholder: "Branch",
              },
            ]}
            onChange={handleFilterChange}
            className="justify-end mb-4"
          />
          {isLoading ? (
            <PageLoader />
          ) : (
            <TableCustom
              data={Leaves?.results || []}
              columns={LeaveRecordColumns}
              pagination={true}
              dataTotalSize={Leaves?.count || 0}
              tableOptions={tableOptions}
            />
          )}
        </CardContent>
      </Card>
      {openAddSpecialLeaveForm && (
        <AddSpecialLeave
          isOpen={openAddSpecialLeaveForm}
          setIsOpen={() => {
            setOpenSpecialLeaveForm(false);
          }}
        // reloadData={()=>{}}
        />
      )}
    </div>
  );
};

export default EmployeeLeaveCount;
