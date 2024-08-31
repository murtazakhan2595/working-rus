import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
  CardTitle,
  CardFooter,
  CardSubTitle,
  CardActions,
  CardSection,
  CardBody,
} from '../../../src/@/components/ui/card';
import { EmployeeColumns } from 'app/utils/Types/TableColumns';
import TableCustom from 'components/TableCustom';
import { UsersRound, Contact, UserRoundCheck, UserPlus } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Link } from 'react-router-dom';
import Header from '../../../components/Header';
import { FilterInput } from 'components/form-control.jsx';
import { UserRoles } from 'data/Data.js';
import { useNavigate } from 'react-router-dom';
import {
  getDepartmentList,
  getDesignationList,
  getEmployeeCustomList,
} from 'app/hooks/general.jsx';

import { PageLoader } from 'components';

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
        console.error('Error fetching users:', error);
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
    onPageChange('page', 1);
    setFilterData((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      if (filterValue === '') {
        delete updatedFilters[filterName];
      } else {
        updatedFilters[filterName] = filterValue;
      }
      return updatedFilters;
    });
  };

  return (
    <div className="flex flex-col gap-4 profile-management">
      <Header
        content={
          <Button variant="default" size="">
            <Link className="flex" to="/create-employee">
              <UserPlus className="w-4 h-4 mr-2" /> On Borad Employee
            </Link>
          </Button>
        }
      />

      {Blocks([
        {
          label: 'Total Employees',
          value: totalEmployee,
          icon: UsersRound,
        },
        {
          label: 'Managers Only',
          value: totalManagers,
          icon: Contact,
        },
        {
          label: 'Active Employees',
          value: activeEmployee,
          icon: UserRoundCheck,
        },
      ])}

      
          <Card>
            <CardHeader>
              <div className="px-3 py-3">
                <FilterInput
                  filters={[
                    {
                      type: 'search',
                      placeholder: 'Search by ID and Name',
                      name: 'id_and_first_name',
                    },
                    {
                      type: 'select-one',
                      option: departments,
                      name: 'department_name',
                      placeholder: 'Department',
                    },
                    {
                      type: 'select-two',
                      option: designations,
                      name: 'department_position',
                      placeholder: 'Designation',
                    },
                    {
                      type: 'select-three',
                      option: UserRoles,
                      name: 'user_role',
                      placeholder: 'Role',
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
                
                    <TableCustom
                      data={employeeData.results || []}
                      columns={EmployeeColumns}
                      pagination={true}
                      dataTotalSize={employeeData.count || 0}
                      tableOptions={tableOptions}
                    />
                  
              )}
            </CardContent>
          </Card>
       
    </div>
  );
};

function Blocks(blocks) {
  return (
    <Card className="flex w-full gap-4 p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Employees Stats</h3>
        <UsersRound className="w-6 h-6 text-muted-foreground" />
      </div>
      <div>
      {blocks &&
        blocks.map((block) => SubBlock(block.label, block.value, block.icon))}
      </div>
      
    </Card>
  );

  function SubBlock(label, value, Icon) {
    return (
      <><div className="flex ">
          <div className="flex items-center justify-center p-4 rounded-full bg-mauve-200">
            <Icon className="h-7 w-7 text-plum-1100" aria-hidden="true" />
          </div>
          <div className="flex flex-col items-center justify-center p-4 rounded-md bg-muted">
            <span className="text-2xl font-bold">{value}</span>
            <p className="text-sm text-muted-foreground">{label}</p>
          </div>
        </div>
      </>

      //   <Card className="grid w-full max-w-md gap-6 p-6">
      //   <div className="flex items-center justify-between">
      //     <h3 className="text-xl font-semibold">Employee Stats</h3>
      //     <UsersIcon className="w-6 h-6 text-muted-foreground" />
      //   </div>
      //   <div className="grid grid-cols-3 gap-4">
      //     <div className="flex flex-col items-center justify-center p-4 rounded-md bg-muted">
      //       <span className="text-2xl font-bold">69</span>
      //       <p className="text-sm text-muted-foreground">Total</p>
      //     </div>
      //     <div className="flex flex-col items-center justify-center p-4 rounded-md bg-muted">
      //       <span className="text-2xl font-bold">21</span>
      //       <p className="text-sm text-muted-foreground">Managers</p>
      //     </div>
      //     <div className="flex flex-col items-center justify-center p-4 rounded-md bg-muted">
      //       <span className="text-2xl font-bold">102</span>
      //       <p className="text-sm text-muted-foreground">Active</p>
      //     </div>
      //   </div>
      // </Card>
    );
  }
}

const mapStateToProps = (state) => ({
  userProfile: state.user.userProfile,
});

export default connect(mapStateToProps)(Employee);
