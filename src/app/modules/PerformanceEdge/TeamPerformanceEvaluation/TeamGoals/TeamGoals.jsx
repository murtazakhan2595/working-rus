import React, { useEffect, useState, useMemo } from "react";
import {
    CardContent,
    CardDescription,
    CardTitle,
    CardHeader,
} from "components/ui/card";
import { FilterInput } from "components/FormControl";
import { Header, PageLoader, TableCustom } from "components";
import { TeamGoalsColumns } from "app/modules/PerformanceEdge/Sections";
import { Tabs, TabsList, TabsTrigger } from "src/@/components/ui/tabs";
import { HasAccess } from "utils/PermissionUtils";
import { GetDispatchStateList, GetEmployeeFilteredList } from "utils/Lists";
import { getEmployeeGoalsList } from "app/hooks/performanceEdge";

const TeamGoals = ({ activeView = "Pending Goals" }) => {
    const isAdminView = HasAccess("VIEW_LEAVE_REQUEST");
    const isBranchView = HasAccess("VIEW_BRN_LEAVE_REQUEST");
    const isDepartmentView = HasAccess("VIEW_DPT_LEAVE_REQUEST");
    const Employees = GetEmployeeFilteredList(true,);
    const Departments = GetDispatchStateList("departments", "common") || [];
    const Branches = GetDispatchStateList("branches", "common") || [];
    const {
        id: user_id,
        branch_id: user_branch,
        department_name: user_department,
    } = GetDispatchStateList("user_details", "emp") || {};

    const [activeTab, setActiveTab] = useState(activeView);
    const [filterData, setFilterData] = useState({ reporting_employees: [user_id] });
    const [isLoading, setIsLoading] = useState(true);
    const [EmployeeGoals, setEmployeeGoals] = useState();
    const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
    const [ordering, setOrdering] = useState("-id");

    const TeamGoalsInnerTabList = useMemo(() => {
        return ["Pending Goals", "Active Goals"];
    }, []);

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
            const filters = { ...filterData, reporting_employees: [user_id] }
            const EmployeeGoals = await getEmployeeGoalsList({
                filterData: filters,
                options,
                ordering,
            });
            if (EmployeeGoals && isMounted) {
                setEmployeeGoals(EmployeeGoals);
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
            // Handle other filters normally
            if (filterValue === "" || filterValue === null) {
                if (filterName === "status") {
                    if (activeTab === "Requests") {
                        updatedFilters[filterName] = "pending";
                    } else if (activeTab === "Records") {
                        updatedFilters[filterName] =
                            "approved,rejected,cancelled_by_employee";
                    }
                } else delete updatedFilters[filterName];
            } else {
                if (filterName === "status")
                    updatedFilters[filterName] = filterValue.toLowerCase();
                else updatedFilters[filterName] = filterValue;
            }

            return updatedFilters;
        });
    };

    const handleTabChange = (tab) => {
        if (tab === "Requests") {
            setFilterData((prev) => ({
                ...prev,
                status: "pending",
            }));
        } else if (tab === "Records") {
            setFilterData((prev) => ({
                ...prev,
                status: "approved,rejected,cancelled_by_employee",
            }));
        }
    };


    return (
        < >
            <Tabs
                defaultValue="Pending Goals"
                className="w-full"
                onValueChange={(tab) => {
                    setActiveTab(tab);
                    handleTabChange(tab);
                }}
                value={activeTab}
            >
                <TabsList>
                    {TeamGoalsInnerTabList.map((tab) => (
                        <TabsTrigger
                            key={tab}
                            value={tab}
                            variant='inner-tab'              >
                            {tab}
                        </TabsTrigger>
                    ))}
                </TabsList>
                <CardHeader className="flex flex-row justify-between items-center gap-4">
                    <div>
                        <CardTitle className="text-primary">{activeTab}</CardTitle>
                        <CardDescription className="text-neutral-1100">
                            {`Here you can view and manage ${activeTab.toLowerCase()} of your team.`}
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <FilterInput
                        filters={[
                            {
                                type: "select",
                                options: Employees,
                                name: "employee",
                                placeholder: "Employee",
                            },
                            {
                                type: "select",
                                options: Departments,
                                name: "department",
                                placeholder: "Department",
                            },

                        ]}
                        onChange={handleFilterChange}
                        className="justify-end mb-4"
                    />
                    {isLoading ? (
                        <PageLoader />
                    ) : (
                        <TableCustom
                            data={EmployeeGoals?.results || []}
                            columns={TeamGoalsColumns(fetchData)}
                            pagination={true}
                            dataTotalSize={EmployeeGoals?.count || 0}
                            tableOptions={tableOptions}
                        />
                    )}
                </CardContent>
            </Tabs>
        </>
    );
};

export default TeamGoals;
