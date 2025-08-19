import React, { useState, useEffect } from "react";
import { saveJobRotation, getJobRotationReasons, getJobRotationRequests, getJobRotationById } from 'app/hooks/transferAndRotation';
import {
    Tabs,
    TabsList,
    TabsTrigger,
} from "src/@/components/ui/tabs";
import {
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "components/ui/card";
import { TableCustom, PageLoader } from "components";
import { HasAccess } from "utils/PermissionUtils";
import { GetDispatchStateList, GetEmployeeFilteredList } from "utils/Lists";
import { FilterInput } from 'components/FormControl'
import { JobRotationColumns } from "../Sections/TableColumns";

const RotationRequests = ({ reload, permittedViewFilterData }) => {
    const isAdminView = HasAccess("VIEW_LEAVE_REQUEST");
    const isBranchView = HasAccess("VIEW_BRN_LEAVE_REQUEST");

    const [isLoading, setIsLoading] = useState(true);
    const [JobRotationList, setJobRotationList] = useState(null);
    const [filterData, setFilterData] = useState({ request_status: "PENDING", });

    const [ordering, setOrdering] = useState("-id");

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
    const tableOptions = {
        page: options.page,
        sizePerPage: options.sizePerPage,
        onPageChange: onPageChange,
        onSortChange: (sortName) => {
            setOrdering(sortName);
        },
    };

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const filter = { ...filterData, ...permittedViewFilterData, request_status: "PENDING" };
            const response = await getJobRotationRequests({
                filterData: filter,
                options,
                ordering,
            });
            setJobRotationList(response);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        let isMounted = true;
        if (permittedViewFilterData) fetchData(isMounted);
        return () => {
            isMounted = false;
        };
    }, [filterData, options, ordering, permittedViewFilterData]);

    useEffect(() => {
        let isMounted = true;
        if (isMounted) {
            onPageChange("page", 1);
            setOrdering("-id");
            fetchData(true);
        }
    }, [reload]);

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
        <CardContent>
            <FilterInput
                filters={[
                    {
                        type: "search",
                        name: "employee",
                        placeholder: "Employee ID/Name",
                    },
                    ...(isAdminView || isBranchView
                        ? [
                            {
                                type: "select",
                                options: 'Departments',
                                name: "department",
                                placeholder: "Department",
                            },
                        ]
                        : []),
                    // ...(isAdminView || !isBranchView
                    //   ? [
                    //     {
                    //       type: "select",
                    //       options: Branches,
                    //       name: "branch",
                    //       placeholder: "Branch",
                    //     },
                    //   ]
                    //   : []),
                    // {
                    //   type: "select",
                    //   options: leaveTypesData || [],
                    //   name: "leave_type",
                    //   placeholder: "Leave Type",
                    // },
                    // {
                    //   type: "date-range",
                    //   name: "date_range",
                    //   placeholder: "Leave Period",
                    // },
                    // ...(activeTab === "Records"
                    //   ? [
                    //     {
                    //       type: "select",
                    //       options: [
                    //         ...GlobalStatusOptions(false),
                    //         {
                    //           label: "Cancelled",
                    //           value: "cancelled_by_employee",
                    //         },
                    //       ],
                    //       name: "status",
                    //       placeholder: "Status",
                    //     },
                    //   ]
                    //   : []),
                ]}
                onChange={handleFilterChange}
                className="justify-end mb-4"
            />
            {isLoading ? (
                <PageLoader />
            ) : (
                <TableCustom
                    data={JobRotationList.results}
                    columns={JobRotationList(fetchData)}
                    pagination={true}
                    dataTotalSize={JobRotationList.count || 0}
                    tableOptions={tableOptions}
                />
            )}
        </CardContent>
    );
};

export default RotationRequests;
