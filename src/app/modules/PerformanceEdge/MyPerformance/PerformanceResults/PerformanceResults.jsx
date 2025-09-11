import React, { useState, useEffect } from "react";
import { getManagerFinalEvaluation } from "app/hooks/performanceEdge";
import {
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    Card,
} from "components/ui/card";
import { TableCustom, PageLoader, Header } from "components";
import { HasAccess } from "utils/PermissionUtils";
import { GetDispatchStateList } from "utils/Lists";
import { FilterInput } from "components/FormControl";
import { PerformanceResultColumns } from "app/modules/PerformanceEdge/Sections";
import { Button } from "components/ui/button";

const PerformanceResults = ({ reload, permittedViewFilterData }) => {
    const Designations = GetDispatchStateList("designations", "common") || [];
    const Departments = GetDispatchStateList("departments", "common") || [];

    const isAdminView = HasAccess("VIEW_LEAVE_REQUEST");
    const isBranchView = HasAccess("VIEW_BRN_LEAVE_REQUEST");

    const [isLoading, setIsLoading] = useState(true);
    const [OpenCreateCycleForm, setOpenCreateCycleForm] = useState(false);
    const [PerformanceResultList, setPerformanceResultList] = useState(null);
    const [filterData, setFilterData] = useState({});

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
            const filter = {
                ...filterData,
                ...permittedViewFilterData,
            };
            const response = await getManagerFinalEvaluation({
                filterData: filter,
                options,
                ordering,
            });
            setPerformanceResultList(response);
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

    console.log(PerformanceResultList);
    const handleRequestClick = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setOpenCreateCycleForm(false);

        const triggeredResquest = event.target.title;
        if (triggeredResquest === 'create-cycle')
            setOpenCreateCycleForm(true);
    }
    return (
        <>
            <CardHeader>
                <CardTitle>Evaluation Results</CardTitle>
                <CardDescription>

                </CardDescription>
            </CardHeader>
            <CardContent>
                <FilterInput
                    filters={[]}
                    onChange={handleFilterChange}
                    className="justify-end mb-4"
                />
                {isLoading ? (
                    <PageLoader />
                ) : (
                    <TableCustom
                        data={PerformanceResultList?.results || []}
                        columns={PerformanceResultColumns(fetchData)}
                        pagination={true}
                        dataTotalSize={PerformanceResultList?.count || 0}
                        tableOptions={tableOptions}
                    />
                )}
            </CardContent>
        </>
    );
};

export default PerformanceResults;
