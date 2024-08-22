import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Card, CardContent, CardHeader, CardDescription, CardTitle, CardFooter, CardSubTitle, CardActions, CardSection, CardBody } from "../../../src/@/components/ui/card";
import { EmployeeColumns } from "app/utils/Types/TableColumns";
import TableCustom from "components/TableCustom";


import EmpDataHeader from "./Screens/Sections/Header.jsx";
import tie from "assets/images/tie.png";
import profile from "assets/images/profile.png";
import active from "assets/images/active.png";
import { FilterInput, CustomDarkButton } from "components/form-control.jsx";
import { UserRoles } from "data/Data.js";
import { useNavigate } from "react-router-dom";
import {
  getDepartmentList,
  getDesignationList,
  getEmployeeCustomList,
} from "app/hooks/general.jsx";

import { PageLoader } from "components";

const Employee = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [employeeData, setEmployeeData] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [filterData, setFilterData] = useState({});
  const [totalEmployee, setTotalEmployee] = useState(0);
  const [activeEmployee, setActiveEmployee] = useState(0);
  const [totalManagers, setTotalManager] = useState(0);
  const navigate = useNavigate();
  const [options, setOptions] = useState({
    page: 1,
    sizePerPage: 10,
  });
  const onPageChange = (name, value) => {
    const pageOptions = options;
    if (pageOptions[name] !== value) {
      pageOptions[name] = value;
      setOptions((prevOptions) => ({ ...prevOptions, ...pageOptions }));
    }
  };

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const employeeData = await getEmployeeCustomList({
          options,
          filterData,
        });
        if (isMounted) {
          setEmployeeData(employeeData);
          setActiveEmployee(employeeData?.ActiveEmployee || 0);
          setTotalEmployee(employeeData?.TotalEmployee || 0);
          setTotalManager(employeeData?.TotalManager || 0);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, [options, filterData]);

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const departmentResponse = await getDepartmentList();
        setDepartments(departmentResponse);
        const designationResponse = await getDesignationList();
        setDesignations(designationResponse);
      } catch (error) {
        console.error(error);
      }
    };

    fetchLists();
  }, []);

  const tableOptions = {
    page: options.page,
    sizePerPage: options.sizePerPage,
    onPageChange: onPageChange,
  };

  const handleFilterChange = (filterName, filterValue) => {
    onPageChange("page", 1);
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
    <div className="screen">
      <EmpDataHeader
        title="Profile Management"
        content={
          <CustomDarkButton
            label={"+ Add Employee"}
            onClick={() => navigate("/create-employee")}
          />
        }
      />
      {Blocks([
        {
          label: "Total Employees",
          value: totalEmployee,
          image: profile,
        },
        {
          label: "Managers Only",
          value: totalManagers,
          image: tie,
        },
        {
          label: "Active Employees",
          value: activeEmployee,
          image: active,
        },
      ])}

      <div className="flex flex-row">
        <div className="flex flex-col w-full">
          <Card>
            <CardHeader>
              <div className="px-3 py-3">
                <FilterInput
                  filters={[
                    {
                      type: "search",
                      placeholder: "Search by ID and Name",
                      name: "id_and_first_name",
                    },
                    {
                      type: "select",
                      option: departments,
                      name: "department_name",
                      placeholder: "Department",
                    },
                    {
                      type: "select",
                      option: designations,
                      name: "department_position",
                      placeholder: "Designation",
                    },
                    {
                      type: "select",
                      option: UserRoles,
                      name: "user_role",
                      placeholder: "Role",
                    },
                  ]}
                  onChange={handleFilterChange}
                />
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div classname="flex flex-row">
                  <div className="flex flex-col w-full">
                    <PageLoader />
                  </div>
                </div>
              ) : (
                <div classname="flex flex-row">
                  <div className="flex flex-col w-full">

                    <TableCustom
                      data={employeeData.results || []}
                      columns={EmployeeColumns}
                      pagination={true}
                      dataTotalSize={employeeData.count || 0}
                      tableOptions={tableOptions}
                    />
                  </div>
                </div>

              )}
            </CardContent>
          </Card>
        </div>
      </div>

    </div>

  );
};

function Blocks(blocks) {
  return (
    <div className="flex flex-row items-center">
      {blocks &&
        blocks.map((block) => SubBlock(block.label, block.value, block.image))}
    </div>
  );

  function SubBlock(label, value, image) {
    return (
      <div md={4} className="flex flex-col mb-3">
        <div className="bg-[#FAFBFC] rounded-[20px] p-4 flex gap-x-[30px] m-1">
          <img src={image} alt="icon" />
          <div>
            <h4 className="text-sm font-normal leading-normal font-lato text-baseGray">
              {label}
            </h4>
            <h2 className="font-lato text-2xl text-[#323333] font-normal leading-normal">
              {value}
            </h2>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  userProfile: state.user.userProfile,
});

export default connect(mapStateToProps)(Employee);
