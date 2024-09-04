import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "../../../components/ui/card.jsx"
import { EmployeeColumns } from 'app/utils/Types/TableColumns';
import TableCustom from 'components/TableCustom';
import { UsersRound, Contact, UserRoundCheck } from 'lucide-react';
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
import SheetOnBorading from "../../../components/ui/sheet-onBording-form";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../../src/@/components/ui/tabs"


export default function Component() {
  const [isLoading, setIsLoading] = useState(true);
  const [employeeData, setEmployeeData] = useState({ results: [], count: 0 });
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [filterData, setFilterData] = useState({});
  const [totalEmployee, setTotalEmployee] = useState(0);
  const [activeEmployee, setActiveEmployee] = useState(0);
  const [totalManagers, setTotalManager] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const navigate = useNavigate();
  const [options, setOptions] = useState({
    page: 1,
    sizePerPage: 10,
  });



  const onPageChange = (name, value) => {
    setOptions((prevOptions) => ({ ...prevOptions, [name]: value }));
  };

  const tableOptions = {
    page: options.page,
    sizePerPage: options.sizePerPage,
    onPageChange: onPageChange,
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await getEmployeeCustomList({ options, filterData });
        setEmployeeData(data);
        setActiveEmployee(data.ActiveEmployee || 0);
        setTotalEmployee(data.TotalEmployee || 0);
        setTotalManager(data.TotalManager || 0);
      } catch (error) {
        console.error('Error fetching employees:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [options, filterData]);

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const [departmentResponse, designationResponse] = await Promise.all([
          getDepartmentList(),
          getDesignationList()
        ]);
        setDepartments(departmentResponse);
        setDesignations(designationResponse);
      } catch (error) {
        console.error('Error fetching lists:', error);
      }
    };

    fetchLists();
  }, []);

  const handleFilterChange = (filterName, filterValue) => {
    onPageChange('page', 1);
    setFilterData(prevFilters => ({
      ...prevFilters,
      [filterName]: filterValue || undefined
    }));
  };

  const Blocks = (blocks) => (
    <div className="flex flex-col items-start gap-2 xl:flex-row xl:items-center lg:flex-row lg:items-center md:flex-row md:items-center">

      

        {blocks.map((block) => (
          <div key={block.label} className="flex flex-row items-center justify-start gap-2 ">
            <div className="flex items-center justify-center p-4 rounded-full bg-mauve-200">
              <block.icon className="h-7 w-7 text-plum-1100" aria-hidden="true"/>
            </div>
            <div className="flex flex-col items-start">
              <div className="text-2xl font-bold leading-none tabular-nums">
              {block.value}     
              </div>
              <div className="font-xl medium text-muted-foreground">
                         {block.label}
              </div>
            </div>
            <div>
            </div>
          </div>
        ))}
      </div>
  

  );

  const filteredEmployees = employeeData.results.filter(employee => {
    if (selectedStatus === 'all') return true;
    return employee.status === selectedStatus;
  });

  return (
    <div className="flex flex-col gap-4 profile-management">
      <Header content={<SheetOnBorading />} />

      {Blocks([
        { label: 'Total Employees', value: totalEmployee, icon: UsersRound },
        { label: 'Managers', value: totalManagers, icon: Contact },
        { label: 'Active Employees', value: activeEmployee, icon: UserRoundCheck },
      ])}

      <Tabs defaultValue="all" className="w-full" onValueChange={setSelectedStatus}>
        <div className="flex flex-col justify-between lg:flex-row md:flex-row xl:flex-row">
          <TabsList className="inline-flex items-center justify-center p-1 bg-white rounded-lg h-9 text-mauve-900">
            <TabsTrigger value="all">All Employees</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
          </TabsList>
          <FilterInput
            filters={[
              { type: 'search', placeholder: 'Search by ID and Name', name: 'id_and_first_name' },
              { type: 'select-one', option: departments, name: 'department_name', placeholder: 'Department' },
              { type: 'select-two', option: designations, name: 'department_position', placeholder: 'Designation' },
              { type: 'select-three', option: UserRoles, name: 'user_role', placeholder: 'Role' },
            ]}
            onChange={handleFilterChange}
          />
        </div>

        {['all', 'active', 'inactive'].map((status) => (
          <TabsContent key={status} value={status}>
            {isLoading ? (
              <PageLoader />
            ) : (
              <Card>
                <CardContent>
                  <TableCustom
                    data={filteredEmployees}
                    columns={EmployeeColumns}
                    pagination={true}
                    dataTotalSize={employeeData.count || 0}
                    tableOptions={tableOptions}

                  />
                </CardContent>
              </Card>

            )}
          </TabsContent>
        ))}
      </Tabs>

    </div>
  );
}