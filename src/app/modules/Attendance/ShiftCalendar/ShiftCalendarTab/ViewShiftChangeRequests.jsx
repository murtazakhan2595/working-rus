import { CardContent } from "components/ui/card";
import { Card } from "components/ui/card";
import React, { useEffect, useState } from "react";
import { CardHeader } from "components/ui/card";
import { CardTitle } from "components/ui/card";
import { getShiftSchedule } from "app/hooks/shiftManagement";
import CustomTable from "components/CustomTable";
import { CardDescription } from "components/ui/card";
import { EmployeeColumns } from "./shiftChangeRequestColumns";
import { getChangeRequestComparison, } from "./shiftScheduleUtils";
import { HasAccess } from "utils/PermissionUtils";
import { useSelector } from "react-redux";
import { FilterInput } from "components/FormControl";
import { PageLoader } from "components";

const ViewShiftChangeRequests = ({ refreshTrigger }) => {
    const Branches = useSelector((state) => state.common.branches);
    const isEditEmployeeShiftPermitted = HasAccess("EDIT_EMPLOYEE_SHIFT");
    const [filterData, setFilterData] = useState({ status: "", });
    const [isLoading, setIsLoading] = useState(false);
    const [shiftChangeRequests, setShiftChangeRequests] = useState({ results: [], count: 0, });
    const [options, setOptions] = useState({ page: 1, sizePerPage: 10, });
    const [ordering, setOrdering] = useState("-id");

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

    const fetchShiftChangeRequests = async (isMounted = true) => {
        try {
            setIsLoading(true);
            const response = await getShiftSchedule({
                filterData: { is_change_request: "true,false", shift_requested: "Manager", ...filterData },
                ordering: ordering,
                options
            });

            if (response && response.results && isMounted) {
                // Load comparison data for each request
                const requestsWithComparison = await Promise.all(
                    response.results.map(async (request) => {
                        const comparisonData = await getChangeRequestComparison(request);
                        return {
                            ...request,
                            comparison_data: comparisonData, // comparisonData is already the array we need
                        };
                    })
                );

                setShiftChangeRequests({
                    ...response,
                    results: requestsWithComparison,
                });
            }
        } catch (error) {
            console.error("Error fetching shift change requests:", error);
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        let isMounted = true;
        fetchShiftChangeRequests(isMounted);
        return () => {
            isMounted = false;
        };
    }, [ordering, options, filterData, refreshTrigger]);


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
        <Card className="mt-6">
            <CardHeader>
                <CardTitle className="text-primary">
                    Shift Change Requests
                </CardTitle>
                <CardDescription className="text-neutral-1100">
                    View and manage shift change requests from Managers.
                </CardDescription>

            </CardHeader>
            <CardContent>
                <FilterInput
                    filters={[
                        {
                            type: "select",
                            options: [
                                { label: "Pending", value: "Pending" },
                                { label: "Approved", value: "Approved" },
                                { label: "Rejected", value: "Rejected" },
                            ],
                            name: "status",
                            placeholder: "Status",
                        },
                        ...(isEditEmployeeShiftPermitted
                            ? [
                                {
                                    type: "select",
                                    options: Branches,
                                    name: "employee_branch",
                                    placeholder: "Filter by Branch",
                                },
                            ]
                            : []),
                    ]}
                    onChange={handleFilterChange}
                    className='justify-end mb-4'
                />
                {isLoading ?
                    <PageLoader />
                    :
                    <CustomTable
                        columns={EmployeeColumns(fetchShiftChangeRequests)}
                        data={shiftChangeRequests?.results || []}
                        pagination={true}
                        dataTotalSize={shiftChangeRequests?.count || 0}
                        tableOptions={tableOptions}
                    />}
            </CardContent>
        </Card>
    );
};

export default ViewShiftChangeRequests;
